#!/usr/bin/env bash
# Group C: defect-injection runner (DJ-1, DJ-2) per UPDATED_PROJECT_PLAN.md
# sections 10 and 18. Runs both injections concurrently in isolated scratch
# copies, each on its own fixed port (5174 for DJ-1, 5175 for DJ-2), distinct
# from the main dev server port 5173. Each scratch dir shares node_modules
# via a read-only symlink (never written to during the run) instead of a
# full npm install. Each injection must FAIL its corresponding assertion in
# tests/e2e/app.spec.js; this script treats that as success (exit 0) and
# treats an unexpected PASS (or crash) as a failure (non-zero exit), proving
# the fail-then-pass oracle behavior required by NEGATIVE/ORACLE coverage.
set -u

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
scratch_root="$(mktemp -d "${TMPDIR:-/tmp}/dj-scratch.XXXXXX")"
trap 'rm -rf "$scratch_root"' EXIT

run_injection() {
  local id="$1" file="$2" port="$3"
  local dir="$scratch_root/$id"
  mkdir -p "$dir"

  # Copy only what's needed to run the spec; reuse node_modules read-only.
  cp -R "$root_dir/src" "$dir/src"
  cp -R "$root_dir/tests" "$dir/tests"
  cp "$root_dir/index.html" "$dir/index.html"
  cp "$root_dir/vite.config.js" "$dir/vite.config.js"
  cp "$root_dir/playwright.config.js" "$dir/playwright.config.js"
  cp "$root_dir/package.json" "$dir/package.json"
  ln -s "$root_dir/node_modules" "$dir/node_modules"
  chmod -R a-w "$dir/node_modules" 2>/dev/null || true

  # Apply the mutation for this defect using the shared defect list.
  node --input-type=module -e "
    import { readFileSync, writeFileSync } from 'node:fs';
    import { defects } from '$root_dir/tests/defects/mutations.js';
    const d = defects.find((x) => x.id === '$id');
    if (!d) { console.error('unknown defect id: $id'); process.exit(1); }
    const path = '$dir/' + d.file;
    const src = readFileSync(path, 'utf8');
    if (!src.includes(d.find)) {
      console.error('mutation anchor not found for $id in ' + path);
      process.exit(1);
    }
    writeFileSync(path, src.replace(d.find, d.replace));
  "
  if [ $? -ne 0 ]; then
    echo "[$id] failed to apply mutation" >&2
    return 1
  fi

  # Rewrite ports in the scratch copy's configs for isolation.
  sed -i "s/port: 5173/port: $port/" "$dir/vite.config.js"
  sed -i "s/127.0.0.1:5173/127.0.0.1:$port/" "$dir/playwright.config.js"

  (
    cd "$dir"
    npx vite --host 127.0.0.1 --port "$port" --strictPort > "$scratch_root/$id.vite.log" 2>&1 &
    vpid=$!
    sleep 2
    npx playwright test tests/e2e/app.spec.js --reporter=line > "$scratch_root/$id.pw.log" 2>&1
    pw_status=$?
    kill "$vpid" 2>/dev/null
    wait "$vpid" 2>/dev/null
    exit "$pw_status"
  )
  local status=$?

  # Expected: the Playwright run FAILS (non-zero) because the defect breaks
  # the corresponding invariant. If it passes (status 0), the oracle did not
  # catch the defect: that is a failure of this injection.
  if [ "$status" -eq 0 ]; then
    echo "[$id] FAIL: expected test failure from injected defect, but suite passed" >&2
    cat "$scratch_root/$id.pw.log" >&2
    return 1
  fi
  echo "[$id] OK: injected defect correctly failed the suite (exit $status)"
  return 0
}

run_injection "DJ-1" "src/App.jsx" 5174 &
pid1=$!
run_injection "DJ-2" "src/main.jsx" 5175 &
pid2=$!

status1=0
status2=0
wait "$pid1" || status1=$?
wait "$pid2" || status2=$?

exit $((status1 + status2))

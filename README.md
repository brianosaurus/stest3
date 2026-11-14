# Haskell Educational Example

A small, self-contained Haskell program (`main.hs`) demonstrating five core
language concepts in a single file, using only the `base` library. No
cabal/stack project scaffold is used — this is intentionally proportional to
a hello-world teaching script.

## Sections

Each section below corresponds to a labeled block of output printed by
`main.hs` when run. Run the program to see the labels in order.

1. **`=== Basic Types ===`** — Basic Types. Demonstrates Haskell's core
   primitive and built-in types: `Int`, `Double`, `Bool`, `String`/`Char`,
   and `Maybe`, with comments explaining each one.

2. **`=== Pure Functions ===`** — Pure Functions. Shows a few small pure
   functions (arithmetic and string transformation) and prints their
   results, illustrating referential transparency.

3. **`=== Pattern Matching ===`** — Pattern Matching. Defines a function
   that uses pattern matching (over a small sum type, list, or `Maybe`) to
   branch on its input's shape.

4. **`=== List and Recursion ===`** — List and Recursion. Includes a
   hand-written recursive function (e.g. factorial or list sum/length) to
   demonstrate recursive problem solving over lists/numbers.

5. **`=== Main/IO ===`** — Main/IO. The `main :: IO ()` action that
   sequences all of the above example functions, printing a labeled divider
   before each one's output.

## Build and run

Using `ghc` (compile then run):

```sh
ghc -Wall -o main main.hs && ./main
```

Using `runghc` (interpret directly, no binary produced):

```sh
runghc main.hs
```

Both commands produce identical output.

### Alternative run commands

If you have Stack or Cabal installed, either of these also works:

```sh
stack runghc main.hs
# or
cabal exec -- runghc main.hs
```
</content>

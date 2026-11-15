const OPERATORS = new Set(['+', '-', '*', '/']);
const MAX_SIG_DIGITS = 12;

function applyOperator(a, op, b) {
  switch (op) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      if (b === 0) return { error: true };
      return a / b;
    default:
      return { error: true };
  }
}

function formatNumber(num) {
  if (!Number.isFinite(num)) return { error: true };
  let str = num.toPrecision(MAX_SIG_DIGITS);
  if (str.includes('e') || str.includes('E')) {
    return { error: true };
  }
  if (str.includes('.')) {
    str = str.replace(/0+$/, '').replace(/\.$/, '');
  }
  return { value: str };
}

// tokens: array alternating number-strings and operator-strings,
// e.g. ['2', '+', '3', '*', '4'] -> left-to-right, no precedence.
function evaluate(tokens) {
  if (!Array.isArray(tokens) || tokens.length === 0) return { error: true };
  if (tokens.length % 2 === 0) return { error: true };

  let acc = Number(tokens[0]);
  if (Number.isNaN(acc)) return { error: true };

  for (let i = 1; i < tokens.length; i += 2) {
    const op = tokens[i];
    const next = Number(tokens[i + 1]);
    if (!OPERATORS.has(op) || Number.isNaN(next)) return { error: true };

    const result = applyOperator(acc, op, next);
    if (typeof result === 'object' && result.error) return { error: true };
    acc = result;
  }

  return formatNumber(acc);
}

export { evaluate, applyOperator };

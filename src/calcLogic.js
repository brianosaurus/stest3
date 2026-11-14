// Pure calculator state-transition functions.
// State shape: { display, stored, operator, decimalUsed, overwrite, error }

export const initialState = {
  display: '0',
  stored: null,
  operator: null,
  decimalUsed: false,
  overwrite: true,
  error: false,
};

function compute(a, b, operator) {
  switch (operator) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      return a / b;
    default:
      return b;
  }
}

export function inputDigit(state, digit) {
  if (state.error) return state;
  if (state.overwrite) {
    return {
      ...state,
      display: digit === '0' ? '0' : digit,
      overwrite: false,
      decimalUsed: false,
    };
  }
  const display = state.display === '0' ? digit : state.display + digit;
  return { ...state, display };
}

export function inputDecimal(state) {
  if (state.error) return state;
  if (state.overwrite) {
    return { ...state, display: '0.', overwrite: false, decimalUsed: true };
  }
  if (state.decimalUsed) return state;
  return { ...state, display: state.display + '.', decimalUsed: true };
}

export function inputOperator(state, operator) {
  if (state.error) return state;
  if (state.display === '0' && state.stored === null) return state;

  if (state.stored !== null && state.operator !== null && !state.overwrite) {
    const a = state.stored;
    const b = parseFloat(state.display);
    const result = compute(a, b, state.operator);
    if (state.operator === '/' && b === 0) {
      return { ...initialState, display: 'Error', error: true };
    }
    return {
      ...state,
      stored: result,
      operator,
      display: String(result),
      overwrite: true,
      decimalUsed: false,
    };
  }

  return {
    ...state,
    stored: parseFloat(state.display),
    operator,
    overwrite: true,
    decimalUsed: false,
  };
}

export function equals(state) {
  if (state.error) return state;
  if (state.operator === null || state.stored === null) return state;

  const a = state.stored;
  const b = parseFloat(state.display);

  if (state.operator === '/' && b === 0) {
    return { ...initialState, display: 'Error', error: true };
  }

  const result = compute(a, b, state.operator);
  return {
    display: String(result),
    stored: null,
    operator: null,
    decimalUsed: String(result).includes('.'),
    overwrite: true,
    error: false,
  };
}

export function clear() {
  return { ...initialState };
}

export function backspace(state) {
  if (state.error) return state;
  if (state.overwrite) return state;

  let display = state.display.slice(0, -1);
  if (display === '' || display === '-') display = '0';

  return {
    ...state,
    display,
    decimalUsed: display.includes('.'),
    overwrite: display === '0' ? true : state.overwrite,
  };
}

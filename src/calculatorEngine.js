// Pure calculator state-machine engine.
// State shape: { operand1, operand2, operator, active, hasDecimal, error }

export function createInitialState() {
  return {
    operand1: '0',
    operand2: '',
    operator: null,
    active: 'operand1',
    hasDecimal: false,
    error: false,
  };
}

function trimExponential(str) {
  // str like "1.234567890e+21" -> trim mantissa trailing zeros
  const [mantissa, exp] = str.split(/[eE]/);
  let m = mantissa;
  if (m.includes('.')) {
    m = m.replace(/0+$/, '').replace(/\.$/, '');
  }
  const sign = exp[0] === '-' ? '-' : '+';
  const digits = exp.replace(/^[+-]/, '');
  return `${m}e${sign}${digits}`;
}

export function formatResult(num) {
  if (num === 0) return '0';
  if (!isFinite(num)) return 'Error';
  const abs = Math.abs(num);
  if (abs >= 1e21 || abs < 1e-10) {
    return trimExponential(num.toPrecision(10));
  }
  let s = num.toPrecision(10);
  if (s.includes('e') || s.includes('E')) {
    return trimExponential(s);
  }
  if (s.includes('.')) {
    s = s.replace(/0+$/, '').replace(/\.$/, '');
  }
  return s;
}

function parseOperand(str) {
  if (str === '' || str === undefined) return 0;
  const v = parseFloat(str);
  return isNaN(v) ? 0 : v;
}

function compute(op1, op2, operator) {
  const a = parseOperand(op1);
  const b = parseOperand(op2);
  switch (operator) {
    case '+':
      return { value: a + b };
    case '-':
      return { value: a - b };
    case '*':
    case '×':
      return { value: a * b };
    case '/':
    case '÷':
      if (b === 0) return { error: true };
      return { value: a / b };
    default:
      return { value: b };
  }
}

export function getDisplay(state) {
  if (state.error) return 'Error';
  if (state.active === 'operand1') return state.operand1;
  return state.operand2 === '' ? '0' : state.operand2;
}

export function applyClear(state) {
  return createInitialState();
}

export function applyDigit(state, digit) {
  let s = state.error ? applyClear(state) : state;
  const seg = s.active;
  const cur = s[seg];
  let next;
  if (cur === '' || cur === '0') {
    next = digit === '0' ? '0' : digit;
  } else {
    next = cur + digit;
  }
  return { ...s, [seg]: next };
}

export function applyDecimal(state) {
  let s = state.error ? applyClear(state) : state;
  if (s.hasDecimal) return s;
  const seg = s.active;
  const cur = s[seg];
  const next = cur === '' || cur === '0' ? '0.' : cur + '.';
  return { ...s, [seg]: next, hasDecimal: true };
}

export function applyBackspace(state) {
  if (state.error) return applyClear(state);
  const seg = state.active;
  const cur = state[seg];
  if (cur === '' || cur === '0' || cur.length <= 1) {
    return { ...state, [seg]: '0', hasDecimal: false };
  }
  let removed = cur.slice(0, -1);
  if (removed === '' || removed === '-') {
    removed = '0';
  }
  return { ...state, [seg]: removed, hasDecimal: removed.includes('.') };
}

export function applyEquals(state) {
  if (state.error) return state;
  if (!state.operator) {
    return state;
  }
  const op2 = state.operand2 === '' ? state.operand1 : state.operand2;
  const result = compute(state.operand1, op2, state.operator);
  if (result.error) {
    return { ...createInitialState(), error: true };
  }
  const formatted = formatResult(result.value);
  return {
    operand1: formatted,
    operand2: '',
    operator: null,
    active: 'operand1',
    hasDecimal: formatted.includes('.'),
    error: false,
  };
}

function stripTrailingDecimal(str) {
  return str.endsWith('.') ? str.slice(0, -1) : str;
}

export function applyOperator(state, op) {
  let s = state.error ? applyClear(state) : state;
  s = { ...s, operand1: stripTrailingDecimal(s.operand1), operand2: stripTrailingDecimal(s.operand2) };

  if (s.operator && s.operand2 === '') {
    // operator override
    return { ...s, operator: op };
  }

  if (s.operator && s.operand2 !== '') {
    // compute then set new operator on result (operator-after-result)
    const computed = applyEquals(s);
    if (computed.error) {
      return computed;
    }
    return {
      ...computed,
      operator: op,
      active: 'operand2',
      operand2: '',
      hasDecimal: false,
    };
  }

  // no pending operator: commit operand1, start operand2
  return {
    ...s,
    operator: op,
    active: 'operand2',
    operand2: '',
    hasDecimal: false,
  };
}

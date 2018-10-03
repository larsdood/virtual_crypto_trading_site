export const formatCrypto = crypto => {
  if (crypto > 10000) {
    return crypto.toFixed(0);
  }
  return crypto.toPrecision(5);
}

export const formatUSD = number => {
  if (typeof number !== 'number') return number;
  if (number > 10000) {
    return `$${number.toFixed(0)}`;
  }
  return `$${number.toFixed(2)}`;
}

export const requireNumberValuesGreaterThanZero = (...values) => 
  values && values.every(value => typeof value === 'number' && value > 0) 

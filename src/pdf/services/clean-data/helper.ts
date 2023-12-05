export const round1Decimal = (num) => {
  const parsedNum = typeof num === 'number' ? num : parseFloat(num) || 0;
  return Math.round(parsedNum * 10) / 10;
};

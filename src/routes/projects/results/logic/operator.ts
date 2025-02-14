// operators.ts

function inRangeOperator(factValue: string, jsonValue: string) {
  const range = JSON.parse(JSON.stringify(jsonValue));
  if (!Array.isArray(range)) throw new Error(`${jsonValue}(range) is not an array`);
  if (range.length !== 2) throw new Error(`${jsonValue}(range) is not a pair`);
  return range[0] < factValue && factValue < range[1];
}

export const operators = {
  inRangeOperator
}

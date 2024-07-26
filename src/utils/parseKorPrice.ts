// TODO: 아래 함수 어떻게 만들어졌는지 정리
export function parseKoreanCurrency(input: string): number {
  let value = 0;
  const units = {
    억: 100000000,
    만: 10000,
    원: 1,
  };

  // 정규식을 사용하여 숫자와 단위를 추출
  const regex = /([\d.]+)\s*(억|만|원)/g;
  let match;

  while ((match = regex.exec(input)) !== null) {
    const [, number, unit] = match;
    value += parseFloat(number) * (units[unit] || 1);
  }

  return value;
}

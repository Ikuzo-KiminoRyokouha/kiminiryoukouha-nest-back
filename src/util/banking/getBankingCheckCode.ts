export function getBankingCheckCode(num) {
  const checkCode = String(num).padStart(9, '0');
  console.log(checkCode);
  return checkCode;
}

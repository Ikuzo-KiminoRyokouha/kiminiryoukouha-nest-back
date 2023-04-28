export async function dateToKor() {
  const date = new Date();
  const year = date.getFullYear(); // 년도
  const month = date.getMonth() + 1; // 월 (0부터 시작하므로 +1 필요)
  const day = date.getDate(); // 일

  const koreanDate: Date = new Date(year, month - 1, day);
  const koreanTimezoneOffset: number = 540;

  koreanDate.setMinutes(koreanDate.getMinutes() + koreanTimezoneOffset);

  return koreanDate;
}

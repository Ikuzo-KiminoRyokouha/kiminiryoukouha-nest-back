export const subtractDate = function (firstDate, secondDate) {
  let interval;

  if (firstDate > secondDate)
    interval = firstDate.getTime() - secondDate.getTime();
  else interval = secondDate.getTime() - firstDate.getTime();

  return Math.floor(interval / (1000 * 60 * 60 * 24));
};

export const isSameDate = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

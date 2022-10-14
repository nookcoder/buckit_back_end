export function getTimeFormat(time: string) {
  const createdTime = new Date(time);
  const year = createdTime.getFullYear();
  const month =
    createdTime.getMonth() + 1 < 10
      ? `0${createdTime.getMonth() + 1}`
      : createdTime.getMonth() + 1;
  const date =
    createdTime.getDate() < 10
      ? `0${createdTime.getDate()}`
      : createdTime.getDate();
  return `${year}-${month}-${date}`;
}

export function getEndTimeFormat(time: string) {
  const createdTime = new Date(time);
  const endTimeStamp = createdTime.setDate(createdTime.getDate() + 1);
  const endDate = new Date(endTimeStamp);
  const year = endDate.getFullYear();
  const month =
    endDate.getMonth() + 1 < 10
      ? `0${endDate.getMonth() + 1}`
      : endDate.getMonth() + 1;
  const date =
    endDate.getDate() < 10 ? `0${endDate.getDate()}` : endDate.getDate();
  const hour =
    endDate.getHours() < 10 ? `0${endDate.getHours()}` : endDate.getHours();
  const min =
    endDate.getMinutes() < 10
      ? `0${endDate.getMinutes()}`
      : endDate.getMinutes();
  return `${year}-${month} -${date} ${hour}:${min}`;
}

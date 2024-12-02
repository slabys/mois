import dayjs from "dayjs";

export const dayMonthYear = (time: Date | string | undefined) => {
  return dayjs(time).format("MM.DD.YYYY");
};

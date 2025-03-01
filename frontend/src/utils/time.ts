import dayjs from "dayjs";

export const isDateString = (value: any): boolean => {
  return typeof value === "string" && !isNaN(Date.parse(value));
};

export const dayMonthYear = (time: Date | string | undefined) => {
  return dayjs(time).format("MM.DD.YYYY");
};

export const dateWithTime = (time: Date | string | undefined) => {
  return dayjs(time).format("MM.DD.YYYY HH:mm");
};

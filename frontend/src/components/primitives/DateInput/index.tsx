import { DateValue, DateInput as MantineDateInput, DateInputProps as MantineDateInputProps } from "@mantine/dates";
import { IconCalendar } from "@tabler/icons-react";
import "dayjs/locale/en";

export interface DateInputProps extends MantineDateInputProps {
  value: DateValue;
  onChange: (value: DateValue) => void;
}

const DateInput = ({ value, onChange, ...props }: DateInputProps) => {
  return (
    <MantineDateInput
      leftSection={<IconCalendar />}
      valueFormat="DD.MM.YYYY"
      placeholder="Date"
      value={value}
      onChange={onChange}
      locale="en"
      {...props}
    />
  );
};

export default DateInput;

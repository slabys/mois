"use client";

import DateInput, { DateInputProps } from "@components/primitives/DateInput";
import Select from "@components/primitives/Select";
import { CustomColumn } from "@components/shared/DynamicSearch";
import { Button, ButtonProps, SelectProps, Table, TextInput, TextInputProps } from "@mantine/core";
import dayjs from "dayjs";

/** Base Column */
interface BaseColumn {
  headerLabel?: string;
  handleOnChange?: (rowId: string, value?: string | null) => void;
}

/** Input column type */
export interface TextInputColumn extends BaseColumn, TextInputProps {
  type: "textInput";
}

/** Input column type */
export interface ButtonColumn extends BaseColumn, ButtonProps {
  type: "button";
}

/** Select column type */
export interface SelectColumn extends BaseColumn, SelectProps {
  type: "select";
}

/** Date column type */
export interface DateColumn extends BaseColumn, DateInputProps {
  type: "date";
}

/** Props for the Dynamic Table */
export interface CustomDynamicColumnsProps {
  rowId: string;
  customColumns: CustomColumn[];
}

const CustomColumnsTBody = ({ rowId, customColumns }: CustomDynamicColumnsProps) => {
  return customColumns.map((col, index) => {
    return (
      <Table.Td key={index}>
        {col.type === "textInput" && (
          <TextInput
            key={`textInput-${rowId}-${index}`}
            label={col.label}
            placeholder={col.placeholder}
            value={col.value}
            onChange={(event) => {
              col.handleOnChange && col.handleOnChange(rowId, event.currentTarget.value);
            }}
          />
        )}
        {col.type === "select" && (
          <Select
            key={`select-${rowId}-${index}`}
            label={col.label}
            data={col.data}
            value={col.value}
            onChange={(value) => {
              col.handleOnChange && col.handleOnChange(rowId, value);
            }}
          />
        )}
        {col.type === "date" && (
          <DateInput
            key={`date-${rowId}-${index}`}
            label={col.label}
            value={col.value}
            onChange={(value) => {
              col.handleOnChange && value && col.handleOnChange(rowId, dayjs(value).toISOString());
            }}
          />
        )}
        {col.type === "button" && (
          <Button
            key={`button-${rowId}-${index}`}
            onClick={() => {
              col.handleOnChange && col.handleOnChange(rowId);
            }}
          >
            {col.children}
          </Button>
        )}
      </Table.Td>
    );
  });
};

export default CustomColumnsTBody;

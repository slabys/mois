import React from "react";
import { Table as AgTable } from "@ag-media/react-pdf-table";
import type { TableProps } from "@ag-media/react-pdf-table/lib/Table";
import { StyleSheet } from "@react-pdf/renderer";

export {
  TR as TableRow,
  TD as TableCell,
  TH as TableHead,
} from "@ag-media/react-pdf-table";

const style = StyleSheet.create({
  table: {
    fontFamily: "Roboto",
    fontSize: 8,
    border: 0,
  },
});

export const Table = (props: TableProps) => (
  <AgTable {...props} style={style.table} />
);

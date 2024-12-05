import { StyleSheet, View } from "@react-pdf/renderer";
import React from "react";
import {
  Table,
  TableCell,
  TableHead,
  TableRow
} from "../components";

// Create styles
const styles = StyleSheet.create({
  row: {
    display: "flex",
    flexDirection: "row",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },

  table: {
    width: "100%",
  },
  centerCell: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
  },
});

// const TableText = (props: { text: string | number; index: number }) => (
//   <EnhancedText
//     style={{
//       padding: 2,
//       marginBottom: 2,
//       backgroundColor: props.index % 2 === 0 ? undefined : "#f8f8f8",
//     }}
//   >
//     {props.text}
//   </EnhancedText>
// );

interface Item {
  amount: number;
  name: string;
  unitPrice: number;
  vatRate: number;
}

interface ItemsTableProps {
  items: Item[];
}

export const ItemsTable = (props: ItemsTableProps) => {
  const intl = new Intl.NumberFormat("cs-CZ", { currency: "CZK" });
  return (
    <View style={styles.table}>
      <Table trStyle={{ paddingBottom: 2 }}>
        <TableHead>
          <TableCell>Amount</TableCell>
          <TableCell>Item name</TableCell>
          <TableCell style={styles.centerCell}>Unit price</TableCell>
          <TableCell style={styles.centerCell}>VAT Rate</TableCell>
          <TableCell style={styles.centerCell}>VAT</TableCell>
          <TableCell style={styles.centerCell}>Total</TableCell>
        </TableHead>

        {props.items.map((e) => (
          <TableRow key={`item_${e.name}_${e.amount}`}>
            <TableCell>{e.amount.toString()}</TableCell>
            <TableCell>{e.name}</TableCell>
            <TableCell style={styles.centerCell}>
              {e.unitPrice.toString()}
            </TableCell>
            <TableCell style={styles.centerCell}>{e.vatRate}%</TableCell>
            <TableCell style={styles.centerCell}>
              {intl.format(e.amount * e.unitPrice * e.vatRate)}
            </TableCell>
            <TableCell style={styles.centerCell}>
              {intl.format(e.amount * e.unitPrice)}
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </View>
  );
};

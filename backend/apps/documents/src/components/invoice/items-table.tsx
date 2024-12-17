import { StyleSheet, View } from "@react-pdf/renderer";
import React from "react";
import { Table, TableCell, TableHead, TableRow } from "../components";
import { formatPrice } from "./price";

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

interface Item {
  amount: number;
  name: string;
  unitPrice: number;
  /**
   * VAT rate 0-100 => 21 = 0.21
   */
  vatRate: number;
}

interface ItemsTableProps {
  items: Item[];
  currency: string;
}

export const ItemsTable = (props: ItemsTableProps) => (
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
            {formatPrice(
              e.amount * e.unitPrice * (e.vatRate / 100),
              props.currency
            )}
          </TableCell>
          <TableCell style={styles.centerCell}>
            {formatPrice(e.amount * e.unitPrice, props.currency)}
          </TableCell>
        </TableRow>
      ))}
    </Table>
  </View>
);

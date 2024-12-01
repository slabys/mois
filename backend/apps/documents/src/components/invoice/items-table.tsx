import { View, StyleSheet } from "@react-pdf/renderer";
import React from "react";
import { EnhancedText } from "../text";

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
});

const TableText = (props: { text: string | number, index: number }) => (
  <EnhancedText style={{ padding: 2, marginBottom: 2, backgroundColor: (props.index % 2 === 0 ? undefined : "#f8f8f8")}}>{props.text}</EnhancedText>
);

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
  return (
    <View style={styles.table}>
      <View style={styles.row}>
        <View style={styles.column}>
          <EnhancedText bold>Amount</EnhancedText>
          {props.items.map((e, i) => (
            <TableText index={i} text={e.amount} />
          ))}
        </View>

        <View style={styles.column}>
          <EnhancedText bold>Item name</EnhancedText>
          {props.items.map((e, i) => (
            <TableText index={i} text={e.name} />
          ))}
        </View>

        <View style={styles.column}>
          <EnhancedText bold>Unit price</EnhancedText>
          {props.items.map((e, i) => (
            <TableText index={i} text={e.unitPrice} />
          ))}
        </View>

        <View style={styles.column}>
          <EnhancedText bold style={{ textAlign: "right" }}>
            VAT Rate
          </EnhancedText>
          {props.items.map((e, i ) => (
            <TableText index={i} text={`${e.vatRate} %`} />
          ))}
        </View>

        <View style={styles.column}>
          <EnhancedText bold style={{ textAlign: "right" }}>
            VAT
          </EnhancedText>
          {props.items.map((e, i) => (
            <TableText index={i} text={(e.unitPrice * e.amount * e.vatRate) / 100} />
          ))}
        </View>

        <View style={styles.column}>
          <EnhancedText
            bold
            style={{ textAlign: "right"}}
          >
            Total
          </EnhancedText>
          {props.items.map((e, i) => (
            <TableText index={i} text={e.unitPrice * e.amount} />
          ))}
        </View>
      </View>
    </View>
  );
};

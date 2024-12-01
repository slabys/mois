import { Image, StyleSheet, View } from "@react-pdf/renderer";
import React from "react";
import { EnhancedText } from "../text";

const styles = StyleSheet.create({
  row: {
    display: "flex",
    flexDirection: "row",
    width: "auto",
  },
  background: {
    backgroundColor: "#287cb3",
    color: "white",
    marginLeft: "auto",
  },
});

interface PriceTotalProps {
  total: number;
  currency: string;
}

export const PriceTotal = (props: PriceTotalProps) => {
  return (
    <View style={[styles.row, styles.background, { padding: 15, width: 350, paddingRight: 30 }]}>
      <EnhancedText bold fontSize={16} style={{ paddingRight: 40 }}>
        Total amount
      </EnhancedText>
      <EnhancedText bold fontSize={16}>
        {props.total} {props.currency}
      </EnhancedText>
    </View>
  );
};

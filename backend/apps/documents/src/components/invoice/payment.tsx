import React from "react";
import { Image, View, StyleSheet } from "@react-pdf/renderer";
import { EnhancedText } from "../text";
import { imageSync } from "qr-image";
import { PaymentCode } from "sepa-payment-code";

const styles = StyleSheet.create({
  column: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  row: {
    display: "flex",
    flexDirection: "row",
  },
  background: {
    backgroundColor: "#287cb3",
    color: "white",
    height: "100%"
  },
  qrImage: {
    width: 96,
    height: 96,
    maxWidth: 96,
    minWidth: 96,
    maxHeight: 96,
    minHeight: 96,
  },
  tableColumn: {
    width: "auto",
    flexGrow: 1,
    justifyContent: "space-around"
  },
  tablePaddingColumn: {
    paddingLeft: 5,
    paddingRight: 5
  },
  table: {
    justifyContent: "space-evenly",
    flexGrow: 1
  }
});

interface PaymentProps {
  receiverName: string;
  ban: string;
  iban: string;
  swift: string;
  variableSymbol: number;
  paymentMethod: string;
  amount: number;
}

export const Payment = (props: PaymentProps) => {
  const content = new PaymentCode(
    props.receiverName,
    props.iban,
    props.amount,
    "TEXT"
  );
  const data = imageSync(content.getPayload(), { type: "png", margin: 2, size: 96 });
  const imageSrc = data.toString("base64");

  return (
    <View style={[styles.row, styles.background, { padding: 15 }]}>
      <View style={{...styles.column, height: "100%", padding: 15}}>
        <EnhancedText color="white" bold style={{ paddingBottom: 10}}>
          Payment details
        </EnhancedText>

        <View style={[styles.row, styles.table]}>
          <View style={[styles.column, styles.tableColumn]}>
            <EnhancedText>BAN</EnhancedText>
            <EnhancedText>IBAN</EnhancedText>
            <EnhancedText>SWIFT</EnhancedText>
          </View>
          <View style={[styles.column, styles.tableColumn]}>
            <EnhancedText bold>{props.ban}</EnhancedText>
            <EnhancedText bold>{props.iban}</EnhancedText>
            <EnhancedText bold>{props.swift}</EnhancedText>
          </View>

          <View style={[styles.column, styles.tableColumn]}>
            <EnhancedText>Payment method</EnhancedText>
            <EnhancedText>Variable symbol</EnhancedText>
            <EnhancedText>           </EnhancedText>
          </View>
          <View style={[styles.column, styles.tableColumn]}>
            <EnhancedText bold>{props.paymentMethod}</EnhancedText>
            <EnhancedText bold>{props.variableSymbol}</EnhancedText>
            <EnhancedText bold>       </EnhancedText>
          </View>
        </View>
      </View>

      <Image
        style={styles.qrImage}
        src={`data:image/png;base64, ${imageSrc}`}
      />
    </View>
  );
};

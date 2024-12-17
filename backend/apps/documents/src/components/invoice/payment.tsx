import React from "react";
import { Image, View, StyleSheet } from "@react-pdf/renderer";
import { imageSync } from "qr-image";
import { createShortPaymentDescriptor } from "@spayd/core";

import { EnhancedText } from "../components";

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
    height: "100%",
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
    justifyContent: "space-around",
  },
  tablePaddingColumn: {
    paddingLeft: 5,
    paddingRight: 5,
  },
  table: {
    justifyContent: "space-evenly",
    flexGrow: 1,
  },
});

interface PaymentProps {
  receiverName: string;
  iban: string;
  swift: string;
  variableSymbol: number;
  amount: number;
  paymentId?: string;
  currency: string;
}

export const Payment = ({
  amount,
  iban,
  receiverName,
  swift,
  variableSymbol,
  paymentId,
  currency,
}: PaymentProps) => {
  const descriptor = createShortPaymentDescriptor({
    acc: iban,
    am: amount.toString(),
    cc: currency,
    rf: variableSymbol.toString(),
    rn: receiverName,
    x: {
      vs: variableSymbol.toString(),
      id: paymentId,
    },
  });

  const data = imageSync(descriptor, {
    type: "png",
    margin: 2,
    size: 96,
  });
  const imageSrc = data.toString("base64");

  return (
    <View style={[styles.row, styles.background, { padding: 15 }]}>
      <View style={{ ...styles.column, height: "100%", padding: 15 }}>
        <EnhancedText color="white" bold style={{ paddingBottom: 10 }}>
          Payment details
        </EnhancedText>

        <View style={[styles.row, styles.table]}>
          <View style={[styles.column, styles.tableColumn]}>
            <EnhancedText>IBAN</EnhancedText>
            <EnhancedText>SWIFT</EnhancedText>
          </View>
          <View style={[styles.column, styles.tableColumn]}>
            <EnhancedText bold>{iban}</EnhancedText>
            <EnhancedText bold>{swift}</EnhancedText>
          </View>

          <View style={[styles.column, styles.tableColumn]}>
            <EnhancedText>Payment method</EnhancedText>
            <EnhancedText>Payment identifier</EnhancedText>
          </View>
          <View style={[styles.column, styles.tableColumn]}>
            <EnhancedText bold>Bank transfer</EnhancedText>
            <EnhancedText bold>{variableSymbol}</EnhancedText>
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

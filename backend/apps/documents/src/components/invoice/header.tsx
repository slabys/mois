import { Image, StyleSheet, View } from "@react-pdf/renderer";
import React from "react";
import { EnhancedText } from "../text";

// Create styles
const styles = StyleSheet.create({
  logo: {
    width: 150,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    padding: 10,
    width: "100%",
  },
  text: {
    textAlign: "right",
  },
});

interface HeaderProps {
  invoiceId: number;
}

export const Header = (props: HeaderProps) => (
  <View style={styles.row}>
    <Image
      fixed={true}
      style={styles.logo}
      src="https://slabys.cz/logo_esncz.png"
    />

    <View style={styles.column}>
      <EnhancedText style={styles.text} fontSize={12} bold>
        INVOICE No. {props.invoiceId}
      </EnhancedText>
    </View>
  </View>
);

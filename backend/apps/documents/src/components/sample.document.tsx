import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

interface SampleDocumentProps {
  text: string;
}

// Sample document with props
export const SampleDocument = (props: SampleDocumentProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Text: {props.text}</Text>
      </View>
    </Page>
  </Document>
);

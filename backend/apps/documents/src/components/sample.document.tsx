import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const currentYear = new Date().getFullYear();

// Create styles
const styles = StyleSheet.create({
  page: { 
    padding: 30, 
    flexDirection: 'column', 
    justifyContent: 'space-between',
    height: '100%'
  },
  header: { fontSize: 15, marginBottom: 20, textAlign: 'center' },
  section: { marginBottom: 15 },
  table: { marginTop: 10, width: '100%' },
  tableRow: { flexDirection: 'row', borderBottom: '1 solid black' },
  tableHeader: { backgroundColor: '#f3f3f3' },
  tableCol: { flex: 1, padding: 5 },
  tableCell: { fontSize: 10 },
  tableCellSmall: { fontSize: 9 },
  content: { flexGrow: 1 },
  footer: { marginTop: 20, textAlign: 'center', fontSize: 12 },
});

interface SampleDocumentProps {
  organization: string,
  customer: string,
  text: string;
}

// Sample document with props
export const SampleDocument = (props: SampleDocumentProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <Text style={styles.header}>Faktura</Text>
      <View style={styles.content}>
      {/* Company and Client Info */}
      <View style={styles.section}>
        <Text>Organizace: {props.organization} </Text>
        <Text>Zákazník: {props.customer}</Text>
      </View>

      {/* Items Table */}
      <View style={styles.table}>
        {/* Header Row */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCol}>Popis</Text>
          <Text style={styles.tableCol}>Množství</Text>
          <Text style={styles.tableCol}>Cena</Text>
          <Text style={styles.tableCol}>Celkem</Text>
        </View>
        {/* Data Rows */}
        <View style={styles.tableRow}>
            <Text style={[styles.tableCol, styles.tableCellSmall]}>Test</Text>
            <Text style={[styles.tableCol, styles.tableCellSmall]}>3</Text>
            <Text style={[styles.tableCol, styles.tableCellSmall]}>4</Text>
            <Text style={[styles.tableCol, styles.tableCellSmall]}>12</Text>
        </View>
      </View>

      {/* Total */}
      <View style={styles.section}>
      <Text style={styles.tableCol}>Celková cena: 12</Text>
      </View>
      </View>
      {/* Footer */}
      <Text style={styles.footer}>ESN {currentYear}</Text>
    </Page>
  </Document>
);

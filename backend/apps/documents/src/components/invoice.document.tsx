import { Document, Page, StyleSheet, View } from "@react-pdf/renderer";
import React from "react";
import {
  Dates,
  Header,
  ItemsTable,
  Payment,
  PriceTotal,
  Subject,
} from "./invoice";
import { EnhancedText } from "./components/text";

const currentYear = new Date().getFullYear();

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  row: {
    display: "flex",
    flexDirection: "row",
  },
  column: {
    display: "flex",
    flexDirection: "column",
  },
  subject: {
    width: "50%",
  },
  header: { fontSize: 15, marginBottom: 20, textAlign: "center" },
  section: { marginBottom: 15 },
  content: { flexGrow: 1 },
  footer: { bottom: 0 },
});

interface SampleDocumentProps {
  organization: string;
  customer: string;
  text: string;
}

// Sample document with props
export const SampleDocument = (props: SampleDocumentProps) => (
  <Document>
    <Page size="A4">
      <View style={styles.page}>
        {/* HEADER */}
        <View style={{ paddingBottom: 20 }}>
          <Header invoiceId={45646456} />
        </View>
        {/* Supplier / subscriber */}
        <View style={styles.row}>
          <View style={styles.subject}>
            <EnhancedText fontSize={12} bold>
              SUPPLIER
            </EnhancedText>
            <Subject
              address={{
                city: "Hradec Králové",
                country: "Czech Republic",
                houseNumber: "977/24",
                region: "Nové Město",
                street: "Senovážné náměstí",
                zip: "110 00",
              }}
              name="Erasmus Student Network Česká republika z. s."
              cin="22678123"
              vatId="CZ22670874"
            />
          </View>
          <View style={styles.subject}>
            <EnhancedText fontSize={12} bold>
              SUBSCRIBER
            </EnhancedText>
            <Subject
              address={{
                city: "Hradec Králové",
                country: "Czech Republic",
                houseNumber: "977/24",
                region: "Nové Město",
                street: "Senovážné náměstí",
                zip: "110 00",
              }}
              name="Erasmus Student Network Česká republika z. s."
            />
          </View>
        </View>
      </View>

      <View style={styles.row}>
        <Payment
          amount={1000}
          receiverName="Hradec Králové"
          ban="2100063040/2010"
          paymentMethod="dsa"
          variableSymbol={2024209}
          swift="FIOBCZPPXXX"
          iban="CZ0820100000002100063040"
        />
        <Dates dateOfIssue={new Date()} dueDate={new Date()} />
      </View>

      <View style={styles.page}>
        <ItemsTable
          items={[
            {
              amount: 10,
              name: "Položka",
              unitPrice: 10,
              vatRate: 21,
            },
            {
              amount: 150,
              name: "Položka",
              unitPrice: 10,
              vatRate: 21,
            },
            {
              amount: 10,
              name: "Položka",
              unitPrice: 10,
              vatRate: 21,
            },
            {
              amount: 200,
              name: "Položka",
              unitPrice: 10,
              vatRate: 21,
            },
            {
              amount: 150,
              name: "Položka",
              unitPrice: 10,
              vatRate: 21,
            },
          ]}
        />
      </View>
      <PriceTotal total={5000} currency="CZK" />
      {/* 
      <Text style={styles.footer} fixed>
        ESN {currentYear}
      </Text> */}
    </Page>
  </Document>
);

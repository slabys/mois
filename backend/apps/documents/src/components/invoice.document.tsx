import { Document, Page, StyleSheet, View } from "@react-pdf/renderer";
import React from "react";

import type { GenerateInvoice } from "../types";
import { EnhancedText } from "./components/text";
import {
  Dates,
  Header,
  ItemsTable,
  Payment,
  PriceTotal,
  Subject,
} from "./invoice";

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

type InvoiceDocumentProps = GenerateInvoice["data"];

// Sample document with props
export const InvoiceDocument = ({
  id,
  payment,
  subscriber,
  supplier,
}: InvoiceDocumentProps) => (
  <Document>
    <Page size="A4">
      <View style={styles.page}>
        {/* HEADER */}
        <View style={{ paddingBottom: 20 }}>
          <Header invoiceId={id} />
        </View>
        {/* Supplier / subscriber */}
        <View style={styles.row}>
          <View style={styles.subject}>
            <EnhancedText fontSize={12} bold>
              SUPPLIER
            </EnhancedText>
            <Subject
              address={{
                city: supplier.address.city,
                country: supplier.address.country,
                houseNumber: supplier.address.houseNumber,
                region: supplier.address.region,
                street: supplier.address.street,
                zip: supplier.address.zip,
              }}
              name={supplier.name}
              cin={supplier.cin}
              vatId={supplier.vatId}
            />
          </View>
          <View style={styles.subject}>
            <EnhancedText fontSize={12} bold>
              SUBSCRIBER
            </EnhancedText>
            <Subject
              address={{
                city: subscriber.address.city,
                country: subscriber.address.country,
                houseNumber: subscriber.address.houseNumber,
                region: subscriber.address.region,
                street: subscriber.address.street,
                zip: subscriber.address.zip,
              }}
              name={subscriber.name}
              cin={subscriber.cin}
              vatId={subscriber.vatId}
            />
          </View>
        </View>
      </View>

      <View style={styles.row}>
        <Payment
          amount={1000}
          receiverName={supplier.name}
          ban={payment.ban}
          paymentMethod="PAYMENT_METHOD"
          variableSymbol={payment.variableSymbol}
          swift={payment.swift}
          iban={payment.iban}
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
      <PriceTotal total={50} currency="CZK" />
    </Page>
  </Document>
);

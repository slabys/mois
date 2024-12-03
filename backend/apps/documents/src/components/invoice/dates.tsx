import { StyleSheet, View } from "@react-pdf/renderer";
import React from "react";
import { EnhancedText } from "../text";

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
    width: "100%",
  },
  subject: {
    width: "50%",
  },
  header: { fontSize: 15, marginBottom: 20, textAlign: "center" },
  section: { marginBottom: 15 },
  content: { flexGrow: 1 },
  footer: { marginTop: 20, textAlign: "center", fontSize: 12 },
  text: {
    paddingBottom: 4,
  },
});

interface DatesProps {
  dueDate: Date;
  dateOfIssue: Date;
}
export const Dates = (props: DatesProps) => {
  const formatDate = (date: Date) =>
    `${date.getDate()}. ${date.getMonth()}. ${date.getFullYear()}`;

  return (
    <View style={{ ...styles.row, padding: 20, paddingRight: 40, width: 300 }}>
      <View style={styles.column}>
        <EnhancedText style={styles.text}>Date of issue</EnhancedText>
        <EnhancedText style={styles.text}>Due date</EnhancedText>
      </View>
      <View style={styles.column}>
        <EnhancedText bold style={[styles.text, { textAlign: "right"}]}>
          {formatDate(props.dateOfIssue)}
        </EnhancedText>
        <EnhancedText bold style={[styles.text, { textAlign: "right"}]}>
          {formatDate(props.dateOfIssue)}
        </EnhancedText>
      </View>
    </View>
  );
};

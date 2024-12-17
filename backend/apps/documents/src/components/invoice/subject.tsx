import { StyleSheet, Text, View } from "@react-pdf/renderer";
import React from "react";
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
});

interface SubjectProps {
  name: string;
  address: {
    street: string;
    houseNumber: string;
    city: string;
    zip: string;
    country: string;
  };

  // ičo
  cin?: string | number;
  // dič
  vatId?: string;
}

export const Subject = (props: SubjectProps) => {
  const { address } = props;
  return (
    <View style={styles.column}>
      <EnhancedText bold>{props.name}</EnhancedText>
      <EnhancedText>
        {address.street} {address.houseNumber}
      </EnhancedText>
      <EnhancedText>
        {address.zip} {address.city}
      </EnhancedText>
      <EnhancedText>{address.country}</EnhancedText>

      <View style={styles.row}>
        {props.cin && (
          <>
            <View style={styles.row}>
              <EnhancedText bold>CIN </EnhancedText>
              <EnhancedText>{props.cin}</EnhancedText>
            </View>
            <Text> </Text>
          </>
        )}

        {props.vatId && (
          <View style={styles.row}>
            <EnhancedText bold>VAT </EnhancedText>
            <EnhancedText>{props.vatId}</EnhancedText>
          </View>
        )}
      </View>
    </View>
  );
};

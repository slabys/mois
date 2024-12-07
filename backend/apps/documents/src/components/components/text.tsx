import React from "react";
import path from "node:path";
import { Font, Text as PdfText, type TextProps } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";

// FIXME: Resolve main path diffent way to prevent deprecation
const fontsFolder = path.resolve(process.mainModule.path, "assets/fonts");

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: path.join(fontsFolder, "Roboto-Regular.ttf"),
      fontWeight: "normal",
    },
    {
      src: path.join(fontsFolder, "Roboto-Bold.ttf"),
      fontWeight: "bold",
    },
  ],
});

interface EnhancedTextProps extends React.PropsWithChildren<TextProps> {
  fontSize?: number | string;
  bold?: boolean;
  color?: string;
  style?: Style | Style[];
}

export const EnhancedText = (props?: EnhancedTextProps) => {
  const styles = Array.isArray(props.style) ? props.style : [props.style];

  return (
    <PdfText
      style={[
        {
          paddingBottom: 2,
        },
        ...styles,
        {
          fontFamily: "Roboto",
          fontSize: props.fontSize ?? 8,
          fontWeight: props.bold ? "bold" : "normal",
          color: props.color,
        },
      ]}
    >
      {props.children}
    </PdfText>
  );
};

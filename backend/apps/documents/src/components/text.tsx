import { Text as PdfText, TextProps, Font } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import path from "path";
import React from "react";

// TODO: Resolve main path
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
  const styles = props.style instanceof Array ? props.style : [props.style];

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

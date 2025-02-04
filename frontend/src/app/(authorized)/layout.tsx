import Layout from "@/components/layout/Layout";
import React, { ReactElement } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactElement;
}>) {
  return <Layout>{children}</Layout>;
}

import { theme } from "@/utils/theme";
import Providers from "@components/layout/Providers";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/tiptap/styles.css";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "ESN Event Registration System",
  description: "Event Registration System for ESN",
  manifest: "/manifest.json",
  keywords: ["ESN", "ERS", "events", "registration"],
  icons: [
    {
      url: "/icons/maskable_icon_x192.png",
      rel: "icon",
    },
    {
      url: "/icons/maskable_icon_x512.png",
      rel: "apple-touch-icon",
    },
  ],
  authors: [
    {
      name: "Šimon Slabý",
      url: "https://www.linkedin.com/in/slabys/",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/icons/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/icons/favicon.svg" />
        <link rel="shortcut icon" href="/icons/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="ESN ERS" />
        <link rel="manifest" href="/manifest.json" />
        <ColorSchemeScript />
      </head>
      <body style={{ width: "100%", height: "100vh" }}>
        <MantineProvider theme={theme}>
          <Providers>{children}</Providers>
        </MantineProvider>
      </body>
    </html>
  );
}

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ESN Event Registration System",
    short_name: "ERS",
    description: "Event Registration System for ESN",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "favicons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "favicons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

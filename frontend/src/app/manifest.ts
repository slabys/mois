import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ESN Event Registration System",
    short_name: "ESN ERS",
    description: "Event Registration System for ESN",
    theme_color: "#228be6",
    background_color: "#ffffff",
    display: "standalone",
    scope: "/",
    start_url: "/",
    icons: [
      {
        purpose: "maskable",
        sizes: "1024x1024",
        src: "/icons/maskable_icon.png",
        type: "image/png",
      },
      {
        sizes: "1024x1024",
        src: "/icons/maskable_icon.png",
        type: "image/png",
      },
      {
        purpose: "maskable",
        sizes: "512x512",
        src: "/icons/maskable_icon_x512.png",
        type: "image/png",
      },
      {
        sizes: "512x512",
        src: "/icons/maskable_icon_x512.png",
        type: "image/png",
      },
      {
        purpose: "maskable",
        sizes: "192x192",
        src: "/icons/maskable_icon_x192.png",
        type: "image/png",
      },
      {
        sizes: "192x192",
        src: "/icons/maskable_icon_x192.png",
        type: "image/png",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/mobile-1.png",
        sizes: "540x720",
        type: "image/png",
        form_factor: "narrow",
        platform: "android",
        label: "Mobile Application",
      },
      {
        src: "/screenshots/desktop-1.png",
        sizes: "1920x958",
        type: "image/png",
        form_factor: "wide",
        label: "Desktop Application",
      },
    ],
  };
}

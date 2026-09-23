import type { Metadata } from "next";
import { ClientProviders } from "@/components/providers";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/kanit/400.css";
import "@fontsource/kanit/500.css";
import "@fontsource/kanit/600.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "MU Connect — Find your people on campus",
  description: "A university community prototype for people, projects, teams, and opportunities.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body><ClientProviders>{children}</ClientProviders></body>
    </html>
  );
}

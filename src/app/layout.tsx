import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";

export const metadata: Metadata = {
  title: "ESP Workshop",
  description: "Firebase Realtime Database Display",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
      {/* <Toaster/> */}
    </html>
  );
}

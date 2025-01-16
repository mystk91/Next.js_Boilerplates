import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Testing",
  description: "A blank layout",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

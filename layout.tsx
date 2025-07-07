import React from "react";
import MainLayout from "@/app/layouts/MainLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brifty",
  description: `The best website this side of cyberspace.`,
  openGraph: {
    title: "Brifty",
    description: "Discover tools and components to build something cool.",
    url: "https://briftysite.com",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brifty",
    description: "Discover tools and components to build something cool.",
    images: ["/twitter-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MainLayout>{children}</MainLayout>;
}

import React from "react";
import ContextLayout from "@/app/layouts/ContextLayout";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ContextLayout>{children}</ContextLayout>;
}
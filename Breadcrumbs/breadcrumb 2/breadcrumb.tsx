"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./breadcrumb.module.css";

const breadcrumbMap: { [key: string]: string } = {
  dictionary: "Our Dictionary",
  "big-words": "Smart Words",
};

export default function Breadcrumb() {
  const pathName = usePathname();
  const pathSegments = pathName.split("/").filter(Boolean);

  return (
    <div className={styles.breadcrumb} aria-label="breadcrumb">
      {pathSegments.map((segment, i) => {
        const label =
          breadcrumbMap[segment] ||
          segment
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        const href = `/${pathSegments.slice(0, i + 1).join("/")}`;
        return i === pathSegments.length - 1 ? (
          <div className={styles.segment} key={i} aria-current="page">
            {label}
          </div>
        ) : (
          <div className={styles.segment} key={i}>
            <Link href={href}>{label}</Link>
            <div>{`>`}</div>
          </div>
        );
      })}
    </div>
  );
}

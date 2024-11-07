"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./banner.module.css";

/**
 * A basic banner with a fixed-attachment background that works on IOS
 */
export default function Banner() {
  return (
    <div className={styles.container}>
      <div className={styles.backgroundWrapper}></div>
      <div className={styles.banner}>
        <div className={styles.bannerText}>Laatresko</div>
      </div>
    </div>
  );
}

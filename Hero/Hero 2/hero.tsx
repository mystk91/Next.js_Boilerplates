"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./hero.module.css";

export default function Hero() {
  return (
    <header className={styles.hero} role="banner">
      <div className={styles.background_wrapper}></div>
      <div className={styles.banner}>
        <h1 className={styles.banner_text}>Laatresko</h1>
      </div>
    </header>
  );
}

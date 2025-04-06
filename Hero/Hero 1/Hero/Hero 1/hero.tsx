"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./hero.module.css";
import HeroNav from "@/app/ui/Hero Nav/Hero Nav 1/heroNav";
import Button from "../../Buttons/Button Set 1/button";

interface HeroProps {
  style?: React.CSSProperties;
}

export default function Hero({ style }: HeroProps) {
  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    return () => {};
  }, []);

  return (
    <header className={styles.hero} style={{ ...style }} role="banner">
      <div className={styles.background_wrapper}></div>
      <div className={styles.hero_content_wrapper}>
        <div className={styles.nav_wrapper}>
          <HeroNav />
        </div>
        <div className={styles.logo_wrapper}></div>
        <div className={styles.heading_wrapper}>
          <h1>{`Unravel Forgotten Mysteries`}</h1>
          <h2>{`Here you can do neat stuff and the get the most value out of it`}</h2>
        </div>
        <div className={styles.buttons_wrapper}>
          <Button
            variant="primary"
            width="smallest"
            style={{ backgroundColor: "rgb(55, 100, 60)" }}
          >{`Get Started`}</Button>
          <Button
            variant="secondary"
            width="smallest"
            style={{
              borderColor: "rgb(45, 82, 50)",
              color: "rgb(42, 73, 46)",
            }}
          >{`Learn More`}</Button>
        </div>
      </div>
    </header>
  );
}

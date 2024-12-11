"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./carousel.module.css";

/*
 * children - the content that will be on the carousel
 * width - the width of the carousel
 * columnGap - the gap between each child
 */
interface CarouselProps {
  children: React.ReactNode;
  width: string;
  columnGap: string;
  style?: {};
}

export default function Carousel({
  children,
  width,
  columnGap,
  style,
}: CarouselProps) {
  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    return () => {};
  }, []);

  return (
    <div
      className={styles.carousel}
      style={{ width: width, maxWidth: width, columnGap: columnGap, ...style }}
      role="region"
      aria-label="Carousel"
    >
      {children}
    </div>
  );
}

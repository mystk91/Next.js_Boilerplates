"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./carousel.module.css";

/*
 * children - the content that will be on the carousel
 * width - the width of the carousel
 * columnGap - the gap between each child
 * scroll - the number of pixels the carousel will scroll by when you hit the arrows
 * style - any additional styles for the component
 */
interface CarouselProps {
  children: React.ReactNode;
  width: string;
  columnGap: string;
  scrollValue: number;
  style?: {};
}

const arrow = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 108.06">
    <path d="M58.94 24.28a14.27 14.27 0 0 1 20.35-20l39.49 40.16a14.28 14.28 0 0 1 0 20l-38.69 39.35a14.27 14.27 0 1 1-20.35-20l15.08-15.38-60.67-.29a14.27 14.27 0 0 1 .24-28.54l59.85.28-15.3-15.58Z" />
  </svg>
);

export default function Carousel({
  children,
  width,
  columnGap,
  style,
  scrollValue,
}: CarouselProps) {
  const carouselRef = useRef<null | HTMLDivElement>(null);

  function scrollForward() {
    const carousel = carouselRef.current;
    if (!carousel) return;
    carousel.scrollTo({
      left: Math.min(
        carousel.scrollLeft + scrollValue,
        carousel.scrollWidth - carousel.clientWidth
      ),
      behavior: "smooth",
    });
  }

  function scrollBackward() {
    const carousel = carouselRef.current;
    if (!carousel) return;
    carousel.scrollTo({
      left: Math.max(carousel.scrollLeft - scrollValue, 0),
      behavior: "smooth",
    });
  }

  return (
    <div className={styles.carousel_container}>
      <div className={styles.carousel_controls}>
        <button
          onClick={scrollBackward}
          className={styles.back}
          aria-label="Scroll backward"
        >
          {arrow}
        </button>
        <button onClick={scrollForward} aria-label="Scroll forward">
          {arrow}
        </button>
      </div>
      <div
        ref={carouselRef}
        className={styles.carousel}
        style={{
          width: width,
          maxWidth: width,
          columnGap: columnGap,
          ...style,
        }}
        role="region"
        aria-label="Carousel"
      >
        {children}
      </div>
    </div>
  );
}

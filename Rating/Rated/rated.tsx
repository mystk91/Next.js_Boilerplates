"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./rated.module.css";

/*
 **  rating - the number of stars something is rated, can give things half-stars. Must have increments of 0.5
 **  maxRating - the maximum number of stars something can have
 */
interface RatedProps {
  rating: number;
  maxRating?: number;
}

const emptyStar = (key: string) => (
  <svg
    key={key}
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 67 63"
    className={styles.emptyStar}
  >
    <path d="m33 10.822 5.797 11.746 1.163 2.357 2.602.378 12.963 1.884-9.38 9.143-1.882 1.835.444 2.591 2.214 12.91-11.594-6.096L33 46.348l-2.327 1.223-11.594 6.096 2.214-12.91.444-2.591-1.882-1.835-9.38-9.143 12.962-1.884 2.602-.378 1.163-2.357L33 10.822M33-.475l-10.281 20.83L-.27 23.696 16.365 39.91l-3.927 22.896L33 51.996l20.562 10.811-3.927-22.897L66.27 23.696l-22.99-3.341L33-.475z" />
  </svg>
);
const halfStar = (key: string) => (
  <svg
    key={key}
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 67 63"
    className={styles.halfStar}
  >
    <path d="m66.27 23.696-22.99-3.341L33-.475l-10.281 20.83L-.27 23.696 16.365 39.91l-3.927 22.896L33 51.996l20.562 10.811-3.927-22.897L66.27 23.696zM35.327 47.57 33 46.348V10.822l5.797 11.746 1.163 2.357 2.602.378 12.963 1.884-9.38 9.143-1.882 1.835.444 2.591 2.214 12.91-11.594-6.096z" />
  </svg>
);

const fullStar = (key: string) => (
  <svg
    key={key}
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={37}
    height={35}
    viewBox="0 0 37 35"
    className={styles.fullStar}
  >
    <path d="m19 .791 5.646 11.438 12.624 1.835-9.135 8.904 2.156 12.573L19 29.604 7.709 35.541l2.156-12.573L.73 14.064l12.624-1.835z" />
  </svg>
);

export default function Rated({ rating, maxRating = 5 }: RatedProps) {
  const starsArr: any = [];
  let i = 0.6;
  while (i < rating) {
    starsArr.push(fullStar(`star-${Math.ceil(i)}`));
    i++;
  }
  if (rating % 1 !== 0) {
    starsArr.push(halfStar(`star-${Math.ceil(i)}`));
    i++;
  }
  while (i < maxRating) {
    starsArr.push(emptyStar(`star-${Math.ceil(i)}`));
    i++;
  }
  return (
    <div
      className={styles.rating}
      aria-label={`Rating: ${rating} out of ${maxRating}`}
    >
      {starsArr}
    </div>
  );
}

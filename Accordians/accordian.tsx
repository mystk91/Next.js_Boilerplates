"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./accordian.module.css";
import classNames from "classnames";

const arrow = (
  <svg
    className={styles.arrow}
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    viewBox="0 0 256 256"
  >
    <defs></defs>
    <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
      <path
        d="M 90 24.25 c 0 -0.896 -0.342 -1.792 -1.025 -2.475 c -1.366 -1.367 -3.583 -1.367 -4.949 0 L 45 60.8 L 5.975 21.775 c -1.367 -1.367 -3.583 -1.367 -4.95 0 c -1.366 1.367 -1.366 3.583 0 4.95 l 41.5 41.5 c 1.366 1.367 3.583 1.367 4.949 0 l 41.5 -41.5 C 89.658 26.042 90 25.146 90 24.25 z"
        transform=" matrix(1 0 0 1 0 0) "
        strokeLinecap="round"
      />
    </g>
  </svg>
);

interface AccordianProps {
  label: string;
  content: React.ReactNode;
}

export default function Accordian({ label, content }: AccordianProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={classNames(
        styles.accordian,
        { [styles.open]: open },
        { [styles.closed]: !open }
      )}
    >
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? `Close Tab` : `Open Tab`}
        aria-expanded={open}
      >
        <div>{label}</div>
        {arrow}
      </button>
      {open ? <div className={styles.accordianContent}>{content}</div> : null}
    </div>
  );
}

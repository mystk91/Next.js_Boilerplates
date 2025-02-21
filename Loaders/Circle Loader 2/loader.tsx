"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./loader.module.css";

interface LoaderProps {
  color?: string;
}

export default function Loader({ color }: LoaderProps) {
  return (
    <div
      className={styles.loader}
      style={{ borderColor: color }}
      role="status"
      aria-live="polite"
      aria-label="Loading..."
    ></div>
  );
}

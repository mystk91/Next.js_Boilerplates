"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./progressBar.module.css";

interface ProgressBarProps {
  percent: number;
  borderRight?: string;
  progressStyle?: {};
  percentStyle?: {};
}

export default function ProgressBar({
  percent,
  borderRight = "1px solid var(--borderColor)",
  progressStyle,
  percentStyle,
}: ProgressBarProps) {
  return (
    <div className={styles.progress_bar} style={{ ...progressStyle }}>
      <div
        className={styles.percent}
        style={{
          width: `${percent}%`,
          borderRight: percent > 0 && percent < 100 ? borderRight : "",
          ...percentStyle,
        }}
      ></div>
    </div>
  );
}

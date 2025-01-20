"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./progressBar.module.css";

interface ProgressBarProps {
  percent: number;
  borderDivider?: string;
  progressStyle?: {};
  percentStyle?: {};
}

export default function ProgressBar({
  percent,
  borderDivider = "2px solid var(--borderColor)",
  progressStyle,
  percentStyle,
}: ProgressBarProps) {
  return (
    <div className={styles.progress_bar} style={{ ...progressStyle }}>
      <div
        className={styles.percent}
        style={{
          width: `${percent}%`,
          ...percentStyle,
        }}
      >
      </div>
      <div className={styles.divider} style={{borderRight: borderDivider }}></div>
      <div className={styles.divider} style={{borderRight: borderDivider }}></div>
      <div className={styles.divider} style={{borderRight: borderDivider }}></div>
      <div className={styles.divider}></div>
    </div>
  );
}

"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  CSSProperties,
} from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./addBadge.module.css";
import classNames from "classnames";

//Adds a basic tag if place within an element that has position:relative;
interface BadgeProps {
  label: string;
  size?: "small" | "medium" | "large";
  shape?: "rectangle" | "pill";
  position:
    | "top"
    | "right"
    | "bottom"
    | "left"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
  color?: string;
  backgroundColor?: string;
  style?: React.CSSProperties;
}

export default function AddBadge({
  label,
  size = "medium",
  shape = "rectangle",
  position,
  color = "var(--foreground)",
  backgroundColor = "var(--background)",
  style,
}: BadgeProps) {
  return (
    <div
      className={classNames(
        styles.badge,
        styles[size],
        styles[position],
        styles[shape]
      )}
      style={{ color: color, backgroundColor: backgroundColor, ...style }}
    >
      <div className={styles.label}>{label}</div>
    </div>
  );
}

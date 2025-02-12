"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import styles from "./button.module.css";
import classNames from "classnames";

interface ButtonProps {
  text: string;
  type: "primary" | "secondary" | "tertiary";
  onClick?: () => void;
  ariaLabel?: string;
  style?: {};
}

export default function Button({
  text,
  type,
  onClick,
  ariaLabel,
  style,
}: ButtonProps) {
  return (
    <button
      style={{ ...style }}
      className={classNames(styles.button, styles[type])}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {text}
    </button>
  );
}

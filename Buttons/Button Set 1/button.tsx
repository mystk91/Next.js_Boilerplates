"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import styles from "./button.module.css";
import classNames from "classnames";

interface ButtonProps {
  text?: string;
  children?: React.ReactNode;
  variant: "primary" | "secondary" | "tertiary";
  onClick?: () => void;
  ariaLabel?: string;
  type?: "button" | "submit" | "reset";
  form?: string;
  name?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  tabIndex?: number;
  id?: string;
  style?: React.CSSProperties;
}

export default function Button({
  text,
  variant,
  onClick,
  children,
  ariaLabel,
  type = "button",
  form,
  name,
  disabled = false,
  autoFocus = false,
  tabIndex,
  id,
  style,
}: ButtonProps) {
  return (
    <button
      id={id}
      name={name}
      className={classNames(styles.button, styles[variant])}
      onClick={onClick}
      aria-label={ariaLabel}
      type={type}
      form={form}
      disabled={disabled}
      autoFocus={autoFocus}
      tabIndex={tabIndex}
      style={{ ...style }}
    >
      {children || text}
    </button>
  );
}

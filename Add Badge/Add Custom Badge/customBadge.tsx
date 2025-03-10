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
interface CustomBadgeProps {
  component: JSX.Element;
  position:
    | "top"
    | "right"
    | "bottom"
    | "left"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
  style?: React.CSSProperties;
}

export default function AddBadge({ component, position }: CustomBadgeProps) {
  return (
    <div className={classNames(styles.badge, styles[position])}>
      {component}
    </div>
  );
}

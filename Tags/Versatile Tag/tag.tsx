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
import styles from "./tag.module.css";
import classNames from "classnames";
import CloseIcon from "./close_icon";

interface TagProps {
  label: string;
  size?: "small" | "medium" | "large";
  shape?: "rectangle" | "pill";
  color?: string;
  backgroundColor?: string;
  closeFunction?: () => void;
  style?: React.CSSProperties;
}

export default function Tag({
  label,
  shape = "rectangle",
  size = "medium",
  color = "black",
  backgroundColor = "white",
  closeFunction,
  style,
}: TagProps) {
  const tagRef = useRef<HTMLDivElement>(null);
  const [showButton, setShowButton] = useState(false);

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (
      tagRef.current &&
      tagRef.current.contains(event.relatedTarget as Node)
    ) {
      return;
    }
    setShowButton(false);
  };

  return (
    <div
      className={classNames(styles.tag, styles[shape], styles[size])}
      style={{ color: color, backgroundColor: backgroundColor, ...style }}
      onMouseEnter={() => setShowButton(true)}
      onFocus={() => setShowButton(true)}
      onMouseLeave={() => setShowButton(false)}
      onBlur={handleBlur}
      tabIndex={1}
      ref={tagRef}
    >
      <div className={styles.label}>{label}</div>
      {closeFunction && showButton && (
        <button
          onClick={closeFunction}
          className={classNames(styles.close_button, styles[size])}
          aria-label={`Remove tag: ${label}`}
          tabIndex={1}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
}

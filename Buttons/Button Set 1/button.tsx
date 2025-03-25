"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import styles from "./button.module.css";
import classNames from "classnames";

interface ButtonProps {
  text?: string;
  children?: React.ReactNode;
  icon?: JSX.Element;
  variant: "primary" | "secondary" | "tertiary";
  onClick?: () => void;
  width?: "default" | "smallest" | "full";
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
  children,
  icon,
  variant,
  width = "default",
  onClick,
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const [active, setActive] = useState(false);
  const enabled = useRef(true);
  const enterKeyDown = useRef(false);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handlePointerDown = () => {
    if (enabled.current) {
      clearTimeout(timeoutRef.current);
      enabled.current = false;
      setActive(false);
      timeoutRef.current = setTimeout(() => {
        setActive(true);
      }, 40);
    }
  };

  const handlePointerUp = () => {
    if (!enabled.current) {
      clearTimeout(timeoutRef.current);
      setActive(true);
      enabled.current = true;
      timeoutRef.current = setTimeout(() => {
        setActive(false);
        onClick?.();
      }, 40);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" && enabled.current) {
      clearTimeout(timeoutRef.current);
      enabled.current = false;
      enterKeyDown.current = true;
      setActive(true);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" && !enabled.current) {
      setActive(false);
      timeoutRef.current = setTimeout(() => {
        enabled.current = true;
        enterKeyDown.current = false;
        onClick?.();
      }, 40);
    }
  };

  const handleMouseLeave = () => {
    if (!enterKeyDown.current) {
      enabled.current = true;
      setActive(false);
    }
  };

  const handleBlur = () => {
    enabled.current = true;
    enterKeyDown.current = false;
    setActive(false);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLButtonElement>) => {
    if (buttonRef.current && e.touches.length > 0) {
      const touch = e.touches[0];
      if (
        !buttonRef.current.contains(
          document.elementFromPoint(touch.clientX, touch.clientY)
        )
      ) {
        setActive(false);
        enabled.current = true;
      }
    }
  };

  return (
    <button
      ref={buttonRef}
      id={id}
      name={name}
      className={classNames(styles.button, styles[variant], styles[width], {
        [styles.active]: active,
      })}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onTouchMove={handleTouchMove}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onMouseLeave={handleMouseLeave}
      onBlur={handleBlur}
      aria-label={ariaLabel}
      type={type}
      form={form}
      disabled={disabled}
      autoFocus={autoFocus}
      tabIndex={tabIndex}
      style={{ ...style }}
    >
      {icon && <div className={styles.icon_container}>{icon}</div>}
      {children || text}
    </button>
  );
}

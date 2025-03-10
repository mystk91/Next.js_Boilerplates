"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./app_icon.module.css";

interface AppIconProps {
  image: JSX.Element;
  notifications?: number;
  name?: string;
  onClickIcon?: () => void;
  onClickText?: () => void;
}

export default function AppIcon({
  image,
  notifications,
  name = "",
  onClickIcon,
  onClickText,
}: AppIconProps) {
  return (
    <div className={styles.app_icon}>
      <div className={styles.button_wrapper}>
        <button
          onClick={onClickIcon}
          aria-label={name ? `Open ${name}` : "Open app"}
        >
          {notifications && (
            <div
              className={styles.notifications}
              aria-label={`There are ${notifications} notifications`}
            >
              {notifications}
            </div>
          )}
          <div className={styles.icon_container}>{image}</div>
        </button>
      </div>
      <span className={styles.app_name} onClick={onClickText}>
        {name}
      </span>
    </div>
  );
}

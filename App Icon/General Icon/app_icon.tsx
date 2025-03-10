"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./app_icon.module.css";

interface Icon {
  image: JSX.Element;
  notifications?: string;
  name?: string;
  onClick?: () => void;
}

export default function Icon({
  image,
  notifications,
  name = "",
  onClick,
}: Icon) {
  return (
    <div className={styles.icon}>
      <div className={styles.button_wrapper}>
        <button onClick={onClick} aria-label={`Do something with ${name}`}>
          {notifications && (
            <div
              className={styles.notifications}
              aria-label={`Notification: ${notifications}`}
            >
              {notifications}
            </div>
          )}
          <div className={styles.icon_container}>{image}</div>
        </button>
      </div>
    </div>
  );
}

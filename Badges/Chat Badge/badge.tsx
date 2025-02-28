"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./badge.module.css";
import classNames from "classnames";

/*
 *   Creates a chat badge
 *   name - the user's name / usernameå
 *   image - src of user's profile image
 *   description - an array with multiple descriptions. Should have at most 4 entries
 *   status - tells if user is currently online, away, or offline
 */
interface BadgeProps {
  name: string;
  description: string[];
  src: string;
  status: "online" | "away" | "offline";
}

export default function Badge({ name, description, src, status }: BadgeProps) {
  return (
    <div className={styles.badge}>
      <div className={styles.avatar}>
        <Image
          src={src}
          alt={`Profile image of ${name}`}
          height={600}
          width={600}
        />
        <div
          className={classNames(styles.status, styles[status])}
          role="status"
          aria-live="polite"
          aria-label={`User is currently ${status}`}
        ></div>
      </div>
      <div className={styles.profile}>
        <span
          className={styles.username}
          aria-label={`Name / Username: ${name}`}
        >
          {name}
        </span>
        <div className={styles.description}>
          {[...description].map((line, i) => {
            return <span key={i}>{line}</span>;
          })}
        </div>
      </div>
    </div>
  );
}

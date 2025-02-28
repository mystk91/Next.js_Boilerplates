"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./badge.module.css";
import Button from "../../Buttons/Button Set 1/button";
import classNames from "classnames";

/*
 *   Creates a chat badge
 *   name - the user's name / usernameå
 *   image - src of user's profile image
 *   description - an array with multiple descriptions
 */
interface BadgeProps {
  name: string;
  description: string[];
  src: string;
}

export default function Badge({ name, description, src }: BadgeProps) {
  return (
    <div className={styles.badge}>
      <div className={styles.avatar}>
        <Image
          src={src}
          alt={`Profile image of ${name}`}
          height={600}
          width={600}
        />
      </div>
      <span className={styles.username} aria-label={`Name / Username: ${name}`}>
        {name}
      </span>
      <div className={styles.description}>
        {[...description].map((line, i) => {
          return <span key={i}>{line}</span>;
        })}
      </div>
      <div className={styles.button_container}>
        <Button type={"primary"} text={"View Profile"} onClick={() => {}} />
      </div>
    </div>
  );
}

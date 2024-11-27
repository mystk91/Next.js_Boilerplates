"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar} aria-label="Main">
      <div className={styles.navbarLeft}></div>
      <div className={styles.navbarRight}></div>
    </nav>
  );
}

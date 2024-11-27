"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import styles from "./navbar.module.css";
import classNames from "classnames";
import SearchBar from "./searchBar";
import Menu from "./menu";


export default function Navbar() {

  return (
    <nav className={styles.navbar} aria-label="Main">
      <div className={styles.navbarLeft}>
        <Menu />
      </div>
      <div className={styles.navbarRight}>
        <SearchBar />
      </div>
    </nav>
  );
}

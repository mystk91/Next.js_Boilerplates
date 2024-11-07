"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./navbar.module.css";
import { usePathname } from "next/navigation";
import classNames from "classnames";

export default function Navbar() {
  const pathName: string = usePathname();
  return (
    <nav className={styles.navbar} aria-label="Main">
      <ul className={styles.navMenu}>
        <div className={styles.navItemContainer}>
          <li className={classNames(styles.navItem, { [styles.active]: pathName === "/" })}><Link href="/">Home</Link></li>
          <li className={classNames(styles.navItem, { [styles.active]: pathName === "/about" })}><Link href="/about">About</Link></li>
          <li className={classNames(styles.navItem, { [styles.active]: pathName === "/forum" })}><Link href="/forum">Forum</Link></li>
          <li className={classNames(styles.navItem, { [styles.active]: pathName === "/store" })}><Link href="/store">Store</Link></li>
        </div>
        <div className={styles.navItemContainer}>
          <li className={classNames(styles.navItem, { [styles.active]: pathName === "/games" })}><Link href="/games">Games</Link></li>
          <li className={classNames(styles.navItem, { [styles.active]: pathName === "/contact" })}><Link href="/contact">Contact</Link></li>
          <li className={classNames(styles.navItem, { [styles.active]: pathName === "/extras" })}><Link href="/extras">Extras</Link></li>
          <li className={classNames(styles.navItem, { [styles.active]: pathName === "/login" })}><Link href="/login">Login</Link></li>
        </div>
      </ul>
    </nav>
  );
}

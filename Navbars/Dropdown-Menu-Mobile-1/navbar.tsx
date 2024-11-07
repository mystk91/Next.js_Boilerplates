"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./navbar.module.css";
import { usePathname } from "next/navigation";
import classNames from "classnames";

export default function Navbar() {
  const pathName: string = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);

  //Ussed to close menu if user clicks elsewhere
  const handleClick = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest(`.${styles.navMenu}`) &&
        !target.closest(`.${styles.menuButton}`)
      ) {
        closeMenu();
      }
    },
    [menuOpen]
  );

  // Add/remove event listener based on menuOpen
  useEffect(() => {
    menuOpen
      ? document.addEventListener("click", handleClick, true)
      : document.removeEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [menuOpen]);

  //For opening / closing mobile menu
  function toggleMenu() {
    if (menuClosing) return;
    menuOpen ? closeMenu() : openMenu();
  }

  //Opens the menu
  function openMenu() {
    setMenuClosing(false);
    setMenuOpen(true);
  }

  //Closes the menu
  function closeMenu() {
    setMenuOpen(false);
    setMenuClosing(true);
    setTimeout(() => {
      setMenuClosing(false);
    }, 150);
  }

  const menuIcon = (
    <svg
      className={classNames(styles.menuIcon, { [styles.open]: menuOpen })}
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      viewBox="0 0 122.88 95.95"
    >
      <path
        d="M8.94 0h105c4.92 0 8.94 4.02 8.94 8.94s-4.02 8.94-8.94 8.94h-105C4.02 17.88 0 13.86 0 8.94S4.02 0 8.94 0zm0 78.07h105c4.92 0 8.94 4.02 8.94 8.94s-4.02 8.94-8.94 8.94h-105C4.02 95.95 0 91.93 0 87.01s4.02-8.94 8.94-8.94zm0-39.04h105c4.92 0 8.94 4.02 8.94 8.94s-4.02 8.94-8.94 8.94h-105C4.02 56.91 0 52.89 0 47.97c0-4.91 4.02-8.94 8.94-8.94z"
        style={{
          fillRule: "evenodd",
          clipRule: "evenodd",
        }}
      />
    </svg>
  );

  return (
    <nav className={styles.navbar} aria-label="Main">
      <button
        className={styles.menuButton}
        onClick={toggleMenu}
        aria-label="Toggle Menu"
      >
        {menuIcon}
      </button>
      <ul
        className={classNames(
          styles.navMenu,
          { [styles.open]: menuOpen },
          { [styles.closing]: menuClosing }
        )}
      >
        <li
          className={classNames(
            styles.navItem,
            { [styles.active]: pathName === "/" },
            { [styles.open]: menuOpen },
            { [styles.closing]: menuClosing }
          )}
        >
          <Link href="/">Home</Link>
        </li>
        <li
          className={classNames(
            styles.navItem,
            { [styles.active]: pathName === "/about" },
            { [styles.open]: menuOpen },
            { [styles.closing]: menuClosing }
          )}
        >
          <Link href="/about">About</Link>
        </li>
        <li
          className={classNames(
            styles.navItem,
            { [styles.active]: pathName === "/forum" },
            { [styles.open]: menuOpen },
            { [styles.closing]: menuClosing }
          )}
        >
          <Link href="/forum">Forum</Link>
        </li>
        <li
          className={classNames(
            styles.navItem,
            { [styles.active]: pathName === "/store" },
            { [styles.open]: menuOpen },
            { [styles.closing]: menuClosing }
          )}
        >
          <Link href="/store">Store</Link>
        </li>
        <li
          className={classNames(
            styles.navItem,
            { [styles.active]: pathName === "/games" },
            { [styles.open]: menuOpen },
            { [styles.closing]: menuClosing }
          )}
        >
          <Link href="/games">Games</Link>
        </li>
        <li
          className={classNames(
            styles.navItem,
            { [styles.active]: pathName === "/contact" },
            { [styles.open]: menuOpen },
            { [styles.closing]: menuClosing }
          )}
        >
          <Link href="/contact">Contact</Link>
        </li>
        <li
          className={classNames(
            styles.navItem,
            { [styles.active]: pathName === "/extras" },
            { [styles.open]: menuOpen },
            { [styles.closing]: menuClosing }
          )}
        >
          <Link href="/extras">Extras</Link>
        </li>
        <li
          className={classNames(
            styles.navItem,
            { [styles.active]: pathName === "/login" },
            { [styles.open]: menuOpen },
            { [styles.closing]: menuClosing }
          )}
        >
          <Link href="/login">Login</Link>
        </li>
      </ul>
    </nav>
  );
}

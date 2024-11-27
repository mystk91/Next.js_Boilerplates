"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./navbar.module.css";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import { useBreakpoint } from "@/app/hooks/useBreakpoint";
import { useClickOff } from "@/app/hooks/useClickOff";

export default function Navbar() {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/forum", label: "Forum" },
    { href: "/games", label: "Games" },
    { href: "/store", label: "Store" },
    { href: "/contact", label: "Contact" },
    { href: "/extras", label: "Extras" },
    { href: "/login", label: "Login" },
  ];
  const pathName: string = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const menuRef = useRef<null | HTMLUListElement>(null);

  useClickOff({
    ref: menuRef,
    onClickOff: closeMenu,
    active: menuOpen,
  });

  useBreakpoint({
    breakpoint: 720,
    onAbove: () => setMenuOpen(false),
    active: menuOpen,
  });

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
    setMenuClosing(true);
    setTimeout(() => {
      setMenuOpen(false);
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
        ref={menuRef}
      >
        {navLinks.map(({ href, label }) => (
          <li
            key={href}
            className={classNames(styles.navItem, {
              [styles.active]: pathName === href,
              [styles.open]: menuOpen,
              [styles.closing]: menuClosing,
            })}
          >
            <Link href={href} onClick={closeMenu}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

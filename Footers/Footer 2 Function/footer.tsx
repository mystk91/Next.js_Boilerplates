"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./footer.module.css";

const linksData = [
  [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Products",
      href: "/products",
    },
    {
      label: "Services",
      href: "/services",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "Support",
      href: "/support",
    },
    {
      label: "FAQ",
      href: "/faq",
    },
    {
      label: "Contact",
      href: "/contact",
    },
  ],
  [
    {
      label: "Terms of Service",
      href: "/info/tos",
    },
    {
      label: "Privacy Policy",
      href: "/info/privacy",
    },
    {
      label: "Cookie Policy",
      href: "/info/cookies",
    },
  ],
];

type Link = {
  label: string;
  href: string;
};

interface FooterProps {
  links?: Link[][];
  message?: string;
  style?: React.CSSProperties;
}

export default function Footer({
  links = linksData,
  message = `© ${new Date().getFullYear()} Company Inc. All rights reserved.`,
  style,
}: FooterProps) {
  return (
    <div className={styles.footer} style={{ ...style }}>
      <div className={styles.footer_content}>
        <div>
          <nav className={styles.footer_nav} aria-label="Footer Links">
            {links.map((list, i) => {
              return (
                <ul key={i}>
                  {list.map((link, j) => {
                    return (
                      <li key={j}>
                        <Link href={link.href}>{link.label}</Link>
                      </li>
                    );
                  })}
                </ul>
              );
            })}
          </nav>
        </div>
        <div className={styles.footer_messsage}>{message}</div>
      </div>
    </div>
  );
}

"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./footer.module.css";

interface FooterProps {
  style?: React.CSSProperties;
}

export default function Footer({ style }: FooterProps) {
  return (
    <div className={styles.footer} style={{ ...style }}>
      <div className={styles.footer_content}>
        <div>
          <nav className={styles.footer_nav} aria-label="Footer Links">
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/products">Products</Link>
              </li>
              <li>
                <Link href="/services">Services</Link>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
              <li>
                <Link href="/support">Support</Link>
              </li>
              <li>
                <Link href="/faq">FAQ</Link>
              </li>
              <li>
                <Link href="/contact">Contact Us</Link>
              </li>
            </ul>
            <ul>
              <li>
                <Link href="/info/tos">Terms of Service</Link>
              </li>
              <li>
                <Link href="/info/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/info/cookies">Cookie Policy</Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className={styles.footer_messsage}>
          © {new Date().getFullYear()} Company Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
}

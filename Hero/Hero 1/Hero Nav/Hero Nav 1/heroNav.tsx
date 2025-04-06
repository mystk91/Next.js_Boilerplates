"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./heroNav.module.css";

interface HeroNavProps {
  style?: React.CSSProperties;
}

export default function HeroNav({ style }: HeroNavProps) {
  const [property, setProperty] = useState<JSX.Element>(<div>Welcome!</div>);

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    return () => {};
  }, []);

  return (
    <nav
      className={styles.hero_nav}
      style={{ ...style }}
      aria-label="Hero Navigation"
    >
      <div className={styles.links_wrapper}>
        <ul className={styles.links}>
          <li>
            <div>
              <Link href="/discover">Discover</Link>
            </div>
          </li>
          <li>
            <div>
              <Link href="/stories">Stories</Link>
            </div>
          </li>
          <li>
            <div>
              <Link href="/resources">Resources</Link>
            </div>
          </li>
          <li>
            <div>
              <Link href="/start">Start Now</Link>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
}

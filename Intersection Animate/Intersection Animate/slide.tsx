"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./slide.module.css";
import classNames from "classnames";

interface SlideProps {
  headline: string;
  body: string;
  style?: React.CSSProperties;
}

export default function Component({ headline, body, style }: SlideProps) {
  const [appear, setAppear] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const slideRef = useCallback((node: HTMLDivElement) => {
    if (!node) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setAppear(true);
      },
      { rootMargin: "-100px" }
    );
    observer.current.observe(node);
  }, []);

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    return () => {};
  }, []);

  return (
    <div style={{ ...style }} className={styles.slide} ref={slideRef}>
      <div className={classNames(styles.headline_wrapper)}>
        <h1 className={classNames({ [styles.appear]: appear })}>{headline}</h1>
      </div>
      <div className={styles.body_wrapper}>
        <div>{body}</div>
      </div>
    </div>
  );
}

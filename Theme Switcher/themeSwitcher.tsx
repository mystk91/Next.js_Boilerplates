"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./themeSwitcher.module.css";
import { useTheme } from "next-themes";

export default function ThemeSwitcher() {
  const themes = ["System", "light", "dark"];
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Creates a ref array to hold the button elements
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const index = themes.indexOf(resolvedTheme || "system");
  const [indicatorStyle, setIndicatorStyle] = useState({
    width: buttonsRef.current[index]?.clientWidth,
    left: buttonsRef.current[index]?.offsetLeft,
  });

  // Moves the indicator
  useEffect(() => {
    const buttonElement = buttonsRef.current[index];
    if (buttonElement) {
      const rect = buttonElement.getBoundingClientRect();
      const parent = buttonElement.parentElement;
      const parentRect = parent?.getBoundingClientRect();
      setIndicatorStyle({
        width: rect.width,
        left: rect.left - parentRect!.left + parent!.scrollLeft,
      });
    }
  }, [theme]);

  return (
    <div className={styles.theme_switcher} role="radiogroup">
      <div className={styles.indicator} style={indicatorStyle}></div>
      {themes.map((entry, index) => {
        return (
          <button
            onClick={() => setTheme(entry)}
            aria-label={`Switch to ${entry} theme`}
            ref={(el) => {
              buttonsRef.current[index] = el;
            }}
            key={index}
          >
            {entry[0].toLocaleUpperCase() + entry.slice(1)}
          </button>
        );
      })}
    </div>
  );
}

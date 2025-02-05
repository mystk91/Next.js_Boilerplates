"use client";
import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import styles from "./tabs.module.css";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface TabsProps {
}

export default function Tabs({  }: TabsProps) {
  // Creates a ref array to hold the button elements for each tab
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const links: { href: string; label: string }[] = [];
  function createLink(href: string, label: string) {
    links.push({
      href: href,
      label: label,
    });
  }
  createLink("/tabs/overview", "Overview");
  createLink("/tabs/details", "Details");
  createLink("/tabs/actions", "Actions");
  createLink("/tabs/long", "This is a long tab");
  createLink("/tabs/summary", "Summary");
  createLink("/tabs/analysis", "Analyze");
  createLink("/tabs/words", "More Words");
  const pathName: string = usePathname();
  let initialTab = 0;
  for (let i = 0; i < links.length; i++) {
    if (links[i].href === pathName) {
      initialTab = i;
      break;
    }
  }
  const [currentTab, setCurrentTab] = useState(initialTab);
  const [underlayStyle, setUnderlayStyle] = useState({
    width: tabRefs.current[currentTab]?.clientWidth,
    left: tabRefs.current[currentTab]?.offsetLeft,
  });

  // Moves the underlay
  useEffect(() => {
    const tabElement = tabRefs.current[currentTab];
    if (tabElement) {
      const rect = tabElement.getBoundingClientRect();
      const parent = tabElement.parentElement;
      const parentRect = parent?.getBoundingClientRect();
      setUnderlayStyle({
        width: rect.width + 12,
        left: rect.left - parentRect!.left + parent!.scrollLeft - 6,
      });
    }
  }, [currentTab]);

  return (
    <div className={styles.container}>
      <div className={styles.tabs} role="tablist">
        {links.map((link, index) => (
          <Link
            key={index}
            className={classNames(styles.tab, {
              [styles.active]: currentTab === index,
            })}
            onClick={() => setCurrentTab(index)}
            href={link.href}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            role="tab"
            aria-controls={`tabpanel-${index}`}
            aria-selected={currentTab === index}
          >
            {link.label}
          </Link>
        ))}
        <div className={styles.underlay} style={underlayStyle}></div>
      </div>
  
    </div>
  );
}

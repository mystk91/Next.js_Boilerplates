"use client";
import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import styles from "./tabs.module.css";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Creates a panel which will be displayed when we click a tab
function TabPanel({ children, index, value }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && <div className={styles.tab_panel}>{children}</div>}
    </div>
  );
}

interface TabsProps {}

export default function Tabs({}: TabsProps) {
  // Creates a ref array to hold the button elements for each tab
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [currentTab, setCurrentTab] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({
    width: tabRefs.current[currentTab]?.clientWidth,
    left: tabRefs.current[currentTab]?.offsetLeft,
  });

  // Moves the indicator
  useEffect(() => {
    const tabElement = tabRefs.current[currentTab];
    if (tabElement) {
      const rect = tabElement.getBoundingClientRect();
      const parent = tabElement.parentElement;
      const parentRect = parent?.getBoundingClientRect();
      setIndicatorStyle({
        width: rect.width + 12,
        left: rect.left - parentRect!.left + parent!.scrollLeft - 6,
      });
    }
  }, [currentTab]);

  return (
    <div className={styles.container}>
      <div className={styles.tabs} role="tablist">
        {[
          "Overview",
          "Details",
          "Actions",
          "This is a long tab with too many words",
          "Summary",
          "Analyze",
          "More Words",
        ].map((label, index) => (
          <button
            key={index}
            className={classNames(styles.tab, {
              [styles.active]: currentTab === index,
            })}
            onClick={() => setCurrentTab(index)}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            role="tab"
            aria-controls={`tabpanel-${index}`}
            aria-selected={currentTab === index}
          >
            <div className={styles.tab_label}>{label}</div>
          </button>
        ))}
        <div className={styles.indicator} style={indicatorStyle}></div>
      </div>

      <div className={styles.tab_panels}>
        <TabPanel value={currentTab} index={0}>
          <div>Panel 1 is cool</div>
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <div>This is panel 2</div>
        </TabPanel>
        <TabPanel value={currentTab} index={2}>
          <div>Third is this panel</div>
        </TabPanel>
        <TabPanel value={currentTab} index={3}>
          <div>4th best panel</div>
        </TabPanel>
        <TabPanel value={currentTab} index={4}>
          <div>Panel 5</div>
        </TabPanel>
        <TabPanel value={currentTab} index={5}>
          <div>Computing...</div>
        </TabPanel>
        <TabPanel value={currentTab} index={6}>
          <div>Yes we need more. Always more.</div>
        </TabPanel>
      </div>
    </div>
  );
}

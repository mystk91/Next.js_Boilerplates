"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import Card from "@/app/ui/Cards/Tooltip Test/card";
import DropdownMenu from "@/app/ui/Menu/Dropdown Menu/dropdownMenu";
import { Item } from "@/app/ui/Menu/Dropdown Menu/dropdownMenu";
import { useRef } from "react";
import classNames from "classnames";
import { useState } from "react";

const menu: Item[] = [
  { type: "link", label: "Home", href: "/" },
  { type: "link", label: "Blog", href: "/blog" },
  {
    type: "submenu",
    label: "Products",
    submenu: [
      { type: "link", label: "Analytics", href: "/products/analytics" },
      { type: "link", label: "Dashboard", href: "/products/dashboard" },
      { type: "decoration", decoration: "space" },
      {
        type: "submenu",
        label: "Enterprise Suite",
        submenu: [
          {
            type: "link",
            label: "Monthly",
            href: "/products/enterprise/monthly",
          },
          {
            type: "link",
            label: "Annual",
            href: "/products/enterprise/annual",
          },
        ],
      },
    ],
  },
  {
    type: "submenu",
    label: "Archive",
    submenu: [
      { type: "link", label: "2024", href: "/archive/2024" },
      { type: "link", label: "2023", href: "/archive/2023" },
      { type: "link", label: "2022", href: "/archive/2022" },
      { type: "link", label: "2021", href: "/archive/2021" },
    ],
  },
  { type: "decoration", decoration: "line" },
  { type: "link", label: "More Info", href: "/info" },
];

export default function Page() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [width, setWidth] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  function changeSize() {
    timerRef.current = setInterval(() => {
      let width = Math.floor(Math.random() * 80) + 60;
      setWidth(width);
    }, 1000);
  }

  return (
    <div className={styles.page}>
      <div
        className={styles.container}
        ref={containerRef}
        style={{
          width: width ? `${width}rem` : undefined,
          transition: "width 1s",
        }}
        onClick={() => {}}
      >
        <DropdownMenu label={"Info"} menu={menu} containerRef={containerRef} />
        <DropdownMenu label={"Stuff"} menu={menu} containerRef={containerRef} />
        <DropdownMenu label={"More"} menu={menu} containerRef={containerRef} />
      </div>
    </div>
  );
}

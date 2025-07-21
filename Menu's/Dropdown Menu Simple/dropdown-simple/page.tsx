"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import Card from "@/app/ui/Cards/Tooltip Test/card";
import DropdownSimple from "@/app/ui/Menu's/Dropdown Menu Simple/dropdownMenu";
import { Item } from "@/app/ui/Menu's/Dropdown Menu Simple/dropdownMenu";
import { useRef } from "react";
import classNames from "classnames";
import { useState } from "react";

const menu: Item[] = [
  { type: "link", label: "Home", href: "/" },
  { type: "link", label: "Blog", href: "/blog" },
  { type: "decoration", decoration: "line" },
  { type: "link", label: "Store", href: "/store" },
  { type: "link", label: "Games", href: "/games" },
  { type: "link", label: "Email", href: "/email" },
  { type: "decoration", decoration: "space" },
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
        <DropdownSimple
          label={"Info"}
          menu={menu}
          containerRef={containerRef}
        />
        <DropdownSimple
          label={"Stuff"}
          menu={menu}
          containerRef={containerRef}
        />
        <DropdownSimple
          label={"More"}
          menu={menu}
          containerRef={containerRef}
        />
      </div>
    </div>
  );
}

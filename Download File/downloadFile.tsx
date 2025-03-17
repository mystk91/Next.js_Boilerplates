"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./component.module.css";
import Button from "../Buttons/Button Set 1/button";

interface ComponentProps {
  style?: React.CSSProperties;
}

export default function Component({ style }: ComponentProps) {
  async function download() {
    try {
      const res = await fetch("/api/download");
      const data = await res.json();
      if (data.error) return;
      const link = document.createElement("a");
      link.href = data.url;
      link.download = data.url.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {}
  }

  return (
    <Button variant="primary" onClick={download} style={style}>
      Download a Wallpaper
    </Button>
  );
}

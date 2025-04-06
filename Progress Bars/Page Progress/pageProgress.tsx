"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import ProgressBarTop from "@/app/ui/progressBar/Progress Bar Top/progressBar";

interface PageProgressProps {}

export default function PageProgress({}: PageProgressProps) {
  const [percent, setPercent] = useState(5);

  const handleScroll = () => {
    setPercent(
      Math.max(
        5,
        (100 * window.scrollY) /
          (document.documentElement.scrollHeight - window.innerHeight)
      )
    );
  };

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return <ProgressBarTop percent={percent} />;
}

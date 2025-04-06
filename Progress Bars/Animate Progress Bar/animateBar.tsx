"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import ProgressBarTop from "@/app/ui/progressBar/Progress Bar Top/progressBar";

/*
 *   time - the time in ms it take for the bar to fill
 *   increment - the amount the progres bar goes each time
 */
interface AnimateBarProps {
  time: number;
  increment: number;
}

export default function AnimateBar({
  time = 1000,
  increment = 5,
}: AnimateBarProps) {
  const [display, setDisplay] = useState(true);
  const [percent, setPercent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    const interval = Math.floor(time / (100 / increment));
    timerRef.current = setInterval(
      () => setPercent((prev) => prev + increment),
      interval
    );
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (percent >= 100) {
      setDisplay(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }
  }, [percent]);

  return display ? <ProgressBarTop percent={percent} /> : null;
}

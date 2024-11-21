"use client";
import { useEffect } from "react";

/*
 ** breakpoint - a breakpoint defined in pixels
 ** onBreakpoint - the function that will be called when the breakpoint is passed either direction
 ** onAbove - the function that will be called when we go above the breakpoint
 ** onBelow - the function that will be called when we go below the breakpoint
 ** active - an optional boolean involving a useState that will "turn on" the handleResize event
 ** initialize - an optional boolean that will let us use our breakpoint functions when we first mount useBreakpoint
 */
type UseBreakpointProps = {
  breakpoint: number;
  onBreakpoint?: () => void;
  onAbove?: () => void;
  onBelow?: () => void;
  active?: boolean;
  initialize?: boolean;
};

// Executes functions when a breakpoint is passed
export const useBreakpoint = ({
  breakpoint,
  onBreakpoint,
  onAbove,
  onBelow,
  active = true,
  initialize = false,
}: UseBreakpointProps) => {
  useEffect(() => {
    // Skip adding event listener if useBreakpoint is not activated
    if (!active) {
      return;
    }
    let windowWidth = window.innerWidth;
    //Uses the breakpoint functions when we mount useBreakpoint
    if (initialize) {
      if (windowWidth > breakpoint) {
        onAbove?.();
        onBreakpoint?.();
      } else {
        onBelow?.();
        onBreakpoint?.();
      }
    }
    const handleResize = () => {
      // Executes the function if window passes the breakpoint either way
      if (window.innerWidth > breakpoint && windowWidth <= breakpoint) {
        onAbove?.();
        onBreakpoint?.();
        windowWidth = window.innerWidth;
      } else if (window.innerWidth <= breakpoint && windowWidth > breakpoint) {
        onBelow?.();
        onBreakpoint?.();
        windowWidth = window.innerWidth;
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [active]);
};

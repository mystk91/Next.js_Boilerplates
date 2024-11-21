"use client";
import { useEffect } from "react";

/*
 ** ref- a ref that will be placed on an element
 ** onClickOff - the function called when user clicks off the element
 ** active - a boolean involving a useState that will "turn on" the clickOff function
 */
type UseClickOffProps<T extends HTMLElement> = {
  ref: React.MutableRefObject<T | null>;
  onClickOff: (e: MouseEvent) => void;
  active: boolean;
};

// Performs a click-off function when you don't click on an element
export const useClickOff = <T extends HTMLElement>({
  ref,
  onClickOff,
  active,
}: UseClickOffProps<T>) => {
  useEffect(() => {
    // Skip adding event listener if useClickOff is not activated
    if (!active) {
      return;
    }
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClickOff(e);
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [active]);
};

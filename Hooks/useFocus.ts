"use client";
import { useEffect } from "react";

/*
 ** ref- a ref that will be placed on an element
 ** active - a boolean involving a useState that will focus on the element once is true
 */
type useFocusProps<T extends HTMLElement> = {
  ref: React.MutableRefObject<T | null>;
  active: boolean;
};

// Focuses an element that has a ref placed onto it
export const useFocus = <T extends HTMLElement>({
  ref,
  active = true,
}: useFocusProps<T>) => {
  useEffect(() => {
    if (active && ref.current) {
      ref.current.focus();
    }
  }, [ref, active]);
};

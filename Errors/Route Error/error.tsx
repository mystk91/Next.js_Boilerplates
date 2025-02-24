"use client"; // Error boundaries must be Client Components
import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./error.module.css";
import Button from "@/app/ui/Buttons/Button Set 1/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className={styles.error} role="alert" aria-live="assertive">
      <h1>Something went wrong! Going up to error.tsx!</h1>
      <Button text={`Try again`} type={"primary"} onClick={reset} />
    </div>
  );
}

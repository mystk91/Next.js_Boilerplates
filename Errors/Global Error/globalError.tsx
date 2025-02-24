"use client"; // Error boundaries must be Client Components
import React, { useState, useEffect, useRef, useCallback } from "react";
import Button from "../../Buttons/Button Set 1/button";
import styles from "./globalError.module.css";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    // global-error must include html and body tags
    <html>
      <body
        style={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: "30vh",
        }}
      >
        <div className={styles.error} role="alert" aria-live="assertive">
          <h1>We had a global error!</h1>
          <Button text="Try again" type="primary" onClick={reset} />
        </div>
      </body>
    </html>
  );
}

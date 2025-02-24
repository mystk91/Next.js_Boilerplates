"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import styles from "./errorExpected.module.css";
import Button from "../../Buttons/Button Set 1/button";

// An error meant to show up after failed data fetches
export default function ExpectedError({ reset }: { reset: () => void }) {
  return (
    <div className={styles.error} role="alert" aria-live="assertive">
      <h1>Something went wrong loading more stuff.</h1>
      <Button text={`Try again`} type={"primary"} onClick={reset} />
    </div>
  );
}

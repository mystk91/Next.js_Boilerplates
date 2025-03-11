"use client"; // Ensure this page is rendered client-side
import React, { useState } from "react";
import styles from "./page.module.css";
import Button from "@/app/ui/Buttons/Button Set 1/button";
import ErrorBoundary from "@/app/ui/Errors/Error Boundary/errorBoundary";

const FaultyComponent = () => {
  const [isError, setIsError] = useState(false);
  const handleClick = () => {
    setIsError(true);
  };

  if (isError) {
    throw new Error("We are throwing an error!!!");
  }

  return (
    <Button
      text={"Make an error happen!"}
      variant={"secondary"}
      onClick={handleClick}
    />
  );
};

export default function Page() {
  return (
    <div className={styles.page}>
      <div>Error Boundary Test</div>
      <ErrorBoundary>
        <FaultyComponent />
      </ErrorBoundary>
    </div>
  );
}

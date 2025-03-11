"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import Button from "@/app/ui/Buttons/Button Set 1/button";
import ExpectedError from "@/app/ui/Errors/Expected Error/errorExpected";

const FaultyComponent = () => {
  const [isError, setIsError] = useState(false);
  const handleClick = () => {
    setIsError(true);
  };
  return (
    <div aria-live="polite">
      {isError ? (
        <ExpectedError reset={() => setIsError(false)} />
      ) : (
        <Button
          text={"Make an error happen!"}
          variant={"secondary"}
          onClick={handleClick}
        />
      )}
    </div>
  );
};

export default function Page() {
  return (
    <div className={styles.page}>
      <div>Expected Error Test</div>
      <FaultyComponent />
    </div>
  );
}

"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./loaderModal.module.css";
import { FocusTrap } from "focus-trap-react";

/**
 *  loader - an inputed loader that will display
 *  backgroundColor - the background color for the modal
 */
interface LoaderModalProps {
  loader: JSX.Element;
  backgroundColor?: string;
}

//Creates a loader thats also a modal
export default function LoaderModal({
  loader,
  backgroundColor,
}: LoaderModalProps) {
  return (
    <FocusTrap>
      <div
        className={styles.backdrop}
        role="alert"
        aria-live="assertive"
        aria-modal="true"
        aria-label="Loading..."
      >
        <div
          className={styles.modal}
          style={{ backgroundColor: backgroundColor }}
          tabIndex={1}
        >
          {loader}
        </div>
      </div>
    </FocusTrap>
  );
}

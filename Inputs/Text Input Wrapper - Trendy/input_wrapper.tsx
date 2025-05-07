"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import TextInput from "@/app/ui/Inputs/Text Input - Trendy/textInput";
import styles from "./input_wrapper.module.css";

interface InputWrapperProps {
  label: string;
  type?: "text" | "password";
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef?: React.Ref<HTMLInputElement>;
  maxLength?: number;
  ariaDescribedBy?: string;
  togglePassword?: boolean;
  error?: string;
}

export default function InputWrapper({
  label,
  type,
  value,
  onChange,
  inputRef,
  maxLength,
  ariaDescribedBy,
  togglePassword,
  error,
}: InputWrapperProps) {
  return (
    <div className={styles.input_wrapper}>
      <TextInput
        label={label}
        type={type}
        value={value}
        onChange={onChange}
        inputRef={inputRef}
        maxLength={maxLength}
        ariaDescribedBy={ariaDescribedBy}
        togglePassword={togglePassword}
      />
      <div className={styles.error}>{error}</div>
    </div>
  );
}

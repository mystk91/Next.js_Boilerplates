"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./user.module.css";
import { useUser } from "@/app/functions/context/userContext";

interface UserProps {
  style?: React.CSSProperties;
}

export default function Hero({ style }: UserProps) {
  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    return () => {};
  }, []);

  const user = useRef(useUser());

  return (
    <div className={styles.user}>
      <div>{`Id: ${user.current.id}`}</div>
      <div>{`Name: ${user.current.name}`}</div>
      <div>{`Email: ${user.current.email}`}</div>
    </div>
  );
}

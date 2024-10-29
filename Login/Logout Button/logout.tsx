"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./logout.module.css";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();
  //URLS
  const logoutURL = "/api/auth/logout";
  const successLink = "/login";

  // Handles logout
  async function logout() {
    try {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      };
      const resLogout = await fetch(logoutURL, options);
      const dataLogout = await resLogout.json();
      if (!dataLogout.errors) {
        router.push(successLink);
      }
    } catch {}
  }

  return (
    <button
      type="button"
      aria-label="Log out"
      className={styles.logout_button}
      onClick={logout}
    >
      {`Log out`}
    </button>
  );
}

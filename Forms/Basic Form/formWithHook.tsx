"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./form.module.css";
import Button from "../Buttons/Button Set 1/button";
import { useFormUpdater } from "@/app/hooks/useFormUpdater";
import { useFocus } from "@/app/hooks/useFocus";

interface FormProps {
  style?: React.CSSProperties;
}

export default function Form({ style }: FormProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  useFocus({ ref: inputRef });
  const [formData, setFormData] = useState({
    name: "",
    dessert: "",
  });
  const handleChange = useFormUpdater(setFormData);

  const initialErrors = {
    name: "",
    dessert: "",
  };
  const [formErrors, setFormErrors] = useState(initialErrors);

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.dessert) return;
    try {
      //Validate data
      const options = {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      };
      const res = await fetch("/some/path", options);
      const data = await res.json();
      if (data.errors) {
        setFormErrors(data.errors);
      } else {
        setFormErrors(initialErrors);
      }
    } catch {
      //Do something to catch the error, this is merely illustrative
      setFormErrors({ name: "", dessert: `We are out of ${formData.dessert}` });
    }
  }

  return (
    <div style={{ ...style }} className={styles.form_container}>
      <form onSubmit={submitForm} aria-label="Order Dessert Form">
        <div className={styles.form_inputs}>
          <div className={styles.input_container}>
            <label htmlFor="name">{`Name`}</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              ref={inputRef}
              aria-describedby="nameError"
            />
            {formErrors.name && (
              <div className={styles.error} id="nameError" aria-live="polite">
                {formErrors.name}
              </div>
            )}
          </div>
          <div className={styles.input_container}>
            <select
              name="dessert"
              id="dessert"
              onChange={handleChange}
              value={formData.dessert}
              aria-describedby="dessertError"
            >
              <option disabled={true} hidden={true} value="">
                Choose a dessert
              </option>
              <optgroup label="Cake">
                <option value="Chocolate Cake">Chocolate Cake</option>
                <option value="Red Velvet">Red Velvet</option>
                <option value="Carrot Cake">Carrot Cake</option>
                <option value="Cheesecake">Cheesecake</option>
              </optgroup>
              <optgroup label="Pie">
                <option value="Apple Pie">Apple Pie</option>
                <option value="Cherry Pie">Cherry Pie</option>
                <option value="Pumpkin Pie">Pumpkin Pie</option>
              </optgroup>
            </select>
            {formErrors.dessert ? (
              <div
                className={styles.error}
                id="dessertError"
                aria-live="polite"
              >
                {formErrors.dessert}
              </div>
            ) : (
              <div className={styles.input_subtext}>Hurry! Not much left!</div>
            )}
          </div>
        </div>
        <div className={styles.submit_button_container}>
          <Button variant={"primary"} type={"submit"} text="Submit" />
        </div>
      </form>
    </div>
  );
}

"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  FormEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/app/ui/Buttons/Button Set 1/button";
import InputWrapper from "@/app/ui/Inputs/Text Input Wrapper - Trendy/input_wrapper";
import classNames from "classnames";
import styles from "./multi-signup.module.css";
import ProgressBar from "@/app/ui/progressBar/Progress Bar FullWidth/progressBar";

interface SignupProps {}

interface PanelProps {
  children: React.ReactNode;
  showCloseAnimation: boolean;
  percent: number;
}

export function Panel({ children, showCloseAnimation, percent }: PanelProps) {
  return (
    <div
      className={classNames(styles.panel_wrapper, {
        [styles.closing]: showCloseAnimation,
      })}
    >
      <ProgressBar
        percent={percent}
        percentStyle={{ backgroundColor: `rgb(46,111,64)` }}
      />
      <div className={classNames(styles.panel)}>{children}</div>
    </div>
  );
}

export default function Signup({}: SignupProps) {
  //For which panel we are currently showing
  const [panel, setPanel] = useState<"email" | "password" | "success">("email");
  const [showCloseAnimation, setShowCloseAnimation] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  //For the progress bar
  const [percent, setPercent] = useState(0);
  //Form handling
  const initialForm = {
    email: "",
    password: "",
    verify_password: "",
  };
  const [formData, setFormData] = useState(initialForm);
  const [formErrors, setFormErrors] = useState(initialForm);
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  //Checks if email is valid and continues the signup if it is
  async function submitEmail(e: FormEvent) {
    e.preventDefault();
    setFormErrors(initialForm);
    let errors = { ...initialForm };
    const emailRegExp = new RegExp(
      "^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,256})$"
    );
    if (!emailRegExp.test(formData.email)) {
      errors.email = `Enter a valid email`;
    }
    const errorFound = Object.values(errors).some(Boolean);
    if (errorFound) {
      setFormErrors(errors);
      return;
    }
    //Check if email exists in DB. (backend not written)
    /*
      const options = {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      };
      const res = await fetch("/api/auth/new_account_email", options);
      const data = await res.json();
      */

    //Moves to password panel
    playCloseAnimation("password");
  }

  async function submitPassword(e: FormEvent) {
    e.preventDefault();
    setFormErrors(initialForm);
    const passwordRegExp = new RegExp(
      "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*[!@#$%^&*_0-9]).{8,32}$"
    );
    let errors = { ...initialForm };
    if (!passwordRegExp.test(formData.password)) {
      errors.verify_password = `Make your password stronger`;
    } else if (formData.password !== formData.verify_password) {
      errors.verify_password = `Passwords do not match`;
    }
    const errorFound = Object.values(errors).some(Boolean);
    if (errorFound) {
      setFormErrors(errors);
      return;
    }
    //Verifies password and creates account (backend not written)
    /*
      const options = {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      };
      const res = await fetch("/api/auth/new_account_password", options);
      const data = await res.json();
      */
    //Move to success panel
    playCloseAnimation("success");
  }

  function playCloseAnimation(newPanel: "email" | "password" | "success") {
    setPercent((prev) => prev + 33);
    setShowCloseAnimation(true);
    timeoutRef.current = setTimeout(() => {
      setShowCloseAnimation(false);
      setPanel(newPanel);
    }, 500);
  }

  //Runs when component mounts, and then when it dismounts
  useEffect(() => {
    setPercent(33);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.signup_wrapper}>
      {panel === "email" && (
        <Panel showCloseAnimation={showCloseAnimation} percent={percent}>
          <form onSubmit={submitEmail}>
            <InputWrapper
              id={`email_input`}
              name={`email`}
              label={`Email`}
              type={`text`}
              value={formData.email}
              onChange={handleChange}
              maxLength={128}
              ariaDescribedBy={`email-error`}
              error={formErrors.email}
              autocomplete="email"
            />
            <Button
              variant="primary"
              type="submit"
              style={{ backgroundColor: `rgb(96, 96, 96)` }}
            >{`Next`}</Button>
          </form>
        </Panel>
      )}
      {panel === "password" && (
        <Panel showCloseAnimation={showCloseAnimation} percent={percent}>
          <form onSubmit={submitPassword}>
            <div className={styles.inputs_wrapper}>
              <InputWrapper
                id={`password_input`}
                name={`password`}
                label={`Password`}
                type={`password`}
                value={formData.password}
                onChange={handleChange}
                maxLength={32}
                ariaDescribedBy={`password-error`}
                error={formErrors.password}
                autocomplete="password"
                togglePassword={true}
              />
              <InputWrapper
                id={`verify_password_input`}
                name={`verify_password`}
                label={`Verify Password`}
                type={`password`}
                value={formData.verify_password}
                onChange={handleChange}
                maxLength={32}
                ariaDescribedBy={`verify-password-error`}
                error={formErrors.verify_password}
                autocomplete="password"
                togglePassword={true}
              />
            </div>
            <Button
              variant="primary"
              type="submit"
              style={{ backgroundColor: `rgb(96, 96, 96)` }}
            >{`Submit`}</Button>
          </form>
        </Panel>
      )}

      {panel === "success" && (
        <Panel showCloseAnimation={showCloseAnimation} percent={percent}>
          <div className={styles.success_message}>
            <div>{`You're almost there!`}</div>
            <div>{`Verify your email to create your account.`}</div>
          </div>
        </Panel>
      )}
    </div>
  );
}

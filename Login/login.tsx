"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function Login() {
  const router = useRouter();
  //Api Routes
  const loginURL = "/api/loginSystem/login";
  // Used to give focus to the form input on load
  const inputReference = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (inputReference.current) {
      inputReference.current.focus();
    }
  }, []);

  //Eye Icons for toggling password visibility
  const eyeSVG = (
    <img
      src="/icons/login/eye-12109.svg"
      alt="Eye Icon"
      className={styles.eye}
    />
  );
  const closedEyeSVG = (
    <img
      src="/icons/login/hidden-12115.svg"
      alt="Closed Eye Icon"
      className={styles.closed_eye}
    />
  );
  // States to toggle password visibility
  const [inputType, setInputType] = useState("password");
  const [eyeIcon, setEyeIcon] = useState(closedEyeSVG);
  // Toggle between eye icons and input types
  function toggleDisplayPassword() {
    const hidden = inputType === "password";
    setInputType(hidden ? "text" : "password");
    setEyeIcon(hidden ? eyeSVG : closedEyeSVG);
  }

  // State for form data and errors
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState({
    email: null as React.ReactNode | null,
    password: null as React.ReactNode | null,
  });

  // Handle input changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  // Handle login submission
  async function login(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      try {
        const options = {
          method: "POST",
          body: JSON.stringify(formData),
          headers: { "Content-Type": "application/json" },
        };
        const resLogin = await fetch(loginURL, options);
        const dataLogin = await resLogin.json();
        console.log(dataLogin);
        if (!dataLogin.errors) {
          //router.push("/profile");
        } else {
          setFormErrors({
            email: dataLogin.errors.email ? (
              <div className={styles.error} id="emailError" aria-live="polite">
                {dataLogin.errors.email}
              </div>
            ) : null,
            password: dataLogin.errors.password ? (
              <div
                className={styles.error}
                id="passwordError"
                role="alert"
                aria-live="polite"
              >
                {dataLogin.errors.password}
              </div>
            ) : null,
          });
        }
      } catch {
        setFormErrors({
          email: null,
          password: (
            <div
              className={styles.error}
              id="emailError"
              role="alert"
              aria-live="polite"
            >
              {`A network error has occurred`}
            </div>
          ),
        });
      }
    }
  }

  //Checks to see if input fields are valid, returns true if valid, otherwise adds error messages and returns false
  function validate(): boolean {
    let emailRegExp = new RegExp(
      "^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,256})$"
    );
    let passwordRegExp = new RegExp(
      "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*[!@#$%^&*_0-9]).{8,32}$"
    );
    //Checks if email address and password are valid
    if (
      !emailRegExp.test(formData.email) ||
      !passwordRegExp.test(formData.password)
    ) {
      setFormErrors({
        email: null,
        password: (
          <div className={styles.error} id="emailError" aria-live="polite">
            {`Wrong username or password`}
          </div>
        ),
      });
      return false;
    } else return true;
  }

  return (
    <div className={styles.login_container} aria-label="Login Container">
      <form
        className={styles.login_form}
        onSubmit={login}
        aria-label="Login Form"
      >
        <div>
          <label htmlFor="email">{`Email`}</label>
          <div className={styles.input_container}>
            <input
              id="email"
              name="email"
              type="text"
              value={formData.email}
              onChange={handleChange}
              ref={inputReference}
              autoComplete="email"
              aria-describedby="emailError"
            />
          </div>
          {formErrors.email}
        </div>
        <div>
          <label htmlFor="password">{`Password`}</label>
          <div className={styles.input_container}>
            <input
              id="password"
              className={styles.password}
              name="password"
              type={inputType}
              maxLength={32}
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              aria-describedby="passwordError"
            />
            <button
              className={styles.toggle_password}
              type="button"
              onClick={toggleDisplayPassword}
              tabIndex={50}
              aria-label={
                inputType === "text" ? "Hide password" : "Show password"
              }
              aria-pressed={inputType === "text"}
            >
              {eyeIcon}
            </button>
          </div>
          {formErrors.password}
          <a
            href="/recover-password"
            className={styles.forgot_password}
            tabIndex={1}
          >{`Forgot Password?`}</a>
        </div>
        <div>
          <button type="submit" className={styles.submit_button}>
            {`Sign in`}
          </button>
        </div>
      </form>
      <div className={styles.signup_link_container}>
        {`Not a member?`}&nbsp;
        <a href="/signup">{`Sign up!`}</a>
      </div>
      <div className={styles.login_options}></div>
    </div>
  );
}

"use client"; // Error boundaries must be Client Components
import React, { Component, ReactNode } from "react";
import styles from "./errorBoundary.module.css";
import Button from "@/app/ui/Buttons/Button Set 1/button";

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Caught by component-level ErrorBoundary:", error);
  }

  resetError = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.error} role="alert" aria-live="assertive">
          <h1>Something went wrong!</h1>
          <Button text="Try again" variant="primary" onClick={this.resetError} />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

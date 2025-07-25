"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  createContext,
  useContext,
} from "react";
import styles from "./modal.module.css";
import { FocusTrap } from "focus-trap-react";
import classNames from "classnames";
import { createPortal } from "react-dom";

/* A flexible modal component that displays inputed content
 * children - the content that will be on the modal
 * closeFunction - a function from the parent used to close the modal there
 * closeButton   - if true, a close button will appear at the top right of the modal
 * closeOnBackdropClick - if true, clicking on the backdrop will close the modal
 * transparent - if true, the backdrop of the modal will be transparent
 * centered - if true, will center the modal vertically rather than being elevated
 * extraTopPadding - if true, will add a little more padding so the closeButton won't overlap with modal content
 * unstyled - if true, removes the default border, background, and padding from modal
 * backdropStyle  - adds any additional styling to the backdrop
 * modalStyle - adds any additional styling to the modal
 */
interface ModalProps {
  children: React.ReactNode;
  closeFunction: () => void;
  closeButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  transparent?: boolean;
  centered?: boolean;
  extraTopPadding?: boolean;
  unstyled?: boolean;
  backdropStyle?: React.CSSProperties;
  modalStyle?: React.CSSProperties;
}

export default function Modal({
  children,
  closeFunction,
  closeButton = false,
  closeOnBackdropClick = false,
  closeOnEscape = true,
  transparent = false,
  centered = false,
  extraTopPadding = false,
  unstyled = false,
  backdropStyle,
  modalStyle,
}: ModalProps) {
  //Closes the modal when user hits ESC
  const escapeKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeFunction();
      }
    },
    [closeFunction]
  );

  //Adds a keydown listener for escapeKey, and prevents the page from scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden";
    if (closeOnEscape) {
      window.addEventListener("keydown", escapeKey);
    }
    return () => {
      document.body.style.overflow = "auto";
      if (closeOnEscape) {
        window.removeEventListener("keydown", escapeKey);
      }
    };
  }, [escapeKey]);

  //Closes the modal on click: for the backdrop and other buttons
  function closeModal(event: React.MouseEvent): void {
    if (event.target === event.currentTarget) {
      closeFunction();
    }
  }

  return createPortal(
    <FocusTrap>
      <div
        className={classNames(styles.backdrop, {
          [styles.pointer]: closeOnBackdropClick,
          [styles.transparent]: transparent,
          [styles.centered]: centered,
        })}
        onClick={closeOnBackdropClick ? closeModal : () => null}
        style={backdropStyle}
      >
        <div
          className={classNames(styles.modal, {
            [styles.top_padding]: closeButton,
            [styles.extra_top_padding]: extraTopPadding,
            [styles.unstyled]: unstyled,
          })}
          role="dialog"
          aria-modal="true"
          style={modalStyle}
        >
          {closeButton && (
            <button
              className={styles.close_button}
              onClick={closeModal}
              aria-label={"Close Modal"}
            >
              <svg
                id="close-icon"
                width="122.878px"
                height="122.88px"
                viewBox="0 0 122.878 122.88"
                enable-background="new 0 0 122.878 122.88"
                className={styles.close_icon}
              >
                <g>
                  <path d="M1.426,8.313c-1.901-1.901-1.901-4.984,0-6.886c1.901-1.902,4.984-1.902,6.886,0l53.127,53.127l53.127-53.127 c1.901-1.902,4.984-1.902,6.887,0c1.901,1.901,1.901,4.985,0,6.886L68.324,61.439l53.128,53.128c1.901,1.901,1.901,4.984,0,6.886 c-1.902,1.902-4.985,1.902-6.887,0L61.438,68.326L8.312,121.453c-1.901,1.902-4.984,1.902-6.886,0 c-1.901-1.901-1.901-4.984,0-6.886l53.127-53.128L1.426,8.313L1.426,8.313z" />
                </g>
              </svg>
            </button>
          )}
          {children}
        </div>
      </div>
    </FocusTrap>,
    document.getElementById("modal-root") as HTMLElement
  );
}

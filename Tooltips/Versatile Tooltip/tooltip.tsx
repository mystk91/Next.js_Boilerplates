"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import styles from "./tooltip.module.css";
import classNames from "classnames";

/*  Creates a basic tooltip for its child components, has modifiable attributes. All units in rem.
 *    children - the elements which the tooltip appears on
 *    direction - the direction which the tooltip will appear relative to its children
 *    arrow? - adds an arrow to the tooltip pointing towards the child elements
 *    arrowPosition? - the horizontal or vertical position of the arrow
 */
interface TooltipProps {
  children: React.ReactNode;
  message: string;
  direction: "top" | "right" | "bottom" | "left";
  offset?: number;
  delay?: number;
  fontSize?: number;
  height?: string;
  width?: string;
  maxWidth?: string;
  color?: string;
  backgroundColor?: string;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
  arrow?: boolean;
  arrowPosition?: "middle" | "top" | "right" | "left" | "bottom";
  arrowLength?: number;
  arrowWidth?: number;
}

export default function Tooltip({
  children,
  message = "",
  direction = "bottom",
  offset = 0.0,
  delay = 0,
  fontSize = 1.4,
  height = "max-content",
  width = "max-content",
  maxWidth = "18.0rem",
  color = "var(--foreground)",
  backgroundColor = "var(--background)",
  borderWidth = 0.1,
  borderColor = "var(--borderColor)",
  borderRadius = 0,
  arrow = false,
  arrowPosition = "middle",
  arrowLength = 0.0,
  arrowWidth = 0.0,
}: TooltipProps) {
  const [active, setActive] = useState(false);
  const [tooltipOffset, setTooltipOffset] = useState(0);
  const tooltipRef = useRef<null | HTMLDivElement>(null);
  const [appear, setAppear] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  function addTooltip() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setActive(true);
    timerRef.current = setTimeout(() => setAppear(true), 1 + delay);
  }

  function removeTooltip() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setAppear(false);
    timerRef.current = setTimeout(() => setActive(false), 500);
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (tooltipRef.current) {
      setTooltipOffset(
        ((direction === "top" || direction === "bottom"
          ? tooltipRef.current.clientHeight
          : tooltipRef.current.clientWidth) +
          arrowLength * 10 +
          offset * 10 +
          borderWidth * 10) /
          10
      );
    }
    return () => {};
  }, [active]);

  function arrowBeforeStyle() {
    let borderWidths = {
      top: [`${arrowLength}rem`, `${arrowWidth}rem`, `0`, `${arrowWidth}rem`],
      right: [`${arrowWidth}rem`, `${arrowLength}rem`, `${arrowWidth}rem`, `0`],
      bottom: [
        `0`,
        `${arrowWidth}rem`,
        `${arrowLength}rem`,
        `${arrowWidth}rem`,
      ],
      left: [`${arrowWidth}rem`, `0`, `${arrowWidth}rem`, `${arrowLength}rem`],
    };
    let borderColors = {
      top: [borderColor, `transparent`, `transparent`, `transparent`],
      right: [`transparent`, borderColor, `transparent`, `transparent`],
      bottom: [`transparent`, `transparent`, borderColor, `transparent`],
      left: [`transparent`, `transparent`, `transparent`, borderColor],
    };
    return {
      borderWidth: borderWidths[direction].join(" "),
      borderColor: borderColors[direction].join(" "),
    };
  }

  function arrowAfterStyle() {
    let borderWidths = {
      top: [
        `${arrowLength - (arrowLength * borderWidth) / arrowWidth}rem`,
        `${arrowWidth - borderWidth}rem`,
        `0`,
        `${arrowWidth - borderWidth}rem`,
      ],
      right: [
        `${arrowWidth - borderWidth}rem`,
        `${arrowLength - (arrowLength * borderWidth) / arrowWidth}rem`,
        `${arrowWidth - borderWidth}rem`,
        `0`,
      ],
      bottom: [
        `0`,
        `${arrowWidth - borderWidth}rem`,
        `${arrowLength - (arrowLength * borderWidth) / arrowWidth}rem`,
        `${arrowWidth - borderWidth}rem`,
      ],
      left: [
        `${arrowWidth - borderWidth}rem`,
        `0`,
        `${arrowWidth - borderWidth}rem`,
        `${arrowLength - (arrowLength * borderWidth) / arrowWidth}rem`,
      ],
    };
    let borderColors = {
      top: [backgroundColor, `transparent`, `transparent`, `transparent`],
      right: [`transparent`, backgroundColor, `transparent`, `transparent`],
      bottom: [`transparent`, `transparent`, backgroundColor, `transparent`],
      left: [`transparent`, `transparent`, `transparent`, backgroundColor],
    };
    let transforms = {
      middle: "",
      top: `translateY(${borderWidth}rem)`,
      bottom: `translateY(-${borderWidth}rem)`,
      right: `translateX(-${borderWidth}rem)`,
      left: `translateX(${borderWidth}rem)`,
    };
    return {
      borderWidth: borderWidths[direction].join(" "),
      borderColor: borderColors[direction].join(" "),
      transform: transforms[arrowPosition],
    };
  }

  return (
    <div className={styles.tooltip_wrapper}>
      {active && (
        <div
          ref={tooltipRef}
          className={classNames(styles.tooltip, {
            [styles.appear]: appear,
          })}
          data-direction={direction}
          data-arrowposition={arrowPosition}
          role="tooltip"
          style={{
            top: direction === "top" ? `-${tooltipOffset}rem` : "",
            right: direction === "right" ? `-${tooltipOffset}rem` : "",
            bottom: direction === "bottom" ? `-${tooltipOffset}rem` : "",
            left: direction === "left" ? `-${tooltipOffset}rem` : "",
            backgroundColor: backgroundColor,
            border: `${borderWidth}rem solid ${borderColor}`,
            borderRadius: `${borderRadius}rem`,
          }}
        >
          {arrow ? (
            <>
              <div
                className={styles.arrow_before}
                style={arrowBeforeStyle()}
              ></div>
              <div
                className={styles.arrow_after}
                style={arrowAfterStyle()}
              ></div>
            </>
          ) : null}
          <div
            className={styles.tooltip_message}
            style={{
              minHeight: height,
              width: width,
              maxWidth: maxWidth,
              fontSize: `${fontSize}rem`,
              color: color,
            }}
          >
            {message}
          </div>
        </div>
      )}
      <div onMouseOver={addTooltip} onMouseLeave={removeTooltip}>
        {children}
      </div>
    </div>
  );
}

"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import styles from "./hoverTooltipPortal.module.css";
import classNames from "classnames";
import { throttle } from "lodash";

/*  Displays a tooltip when you hover over an element
 *    children       - the elements which the click event will be given to
 *    tooltip          - the tooltip that will be displayed on hover
 *    tooltipId       - id for the tooltip, used in aria
 *    direction      - the direction which the tooltip will be anchored to
 *    portalTargetRef - the ref to which the tooltip will be appended to
 *    anchorRef       - optional ref, tooltip will position itself relative to the anchorRef rather than children
 *    offset         - adds a gap between the children and the tooltip, in rem (can be negative also)
 *    shiftRem?      - shifts the tooltip in rem
 *    shiftChildPercent?  - shifts the tooltip, by a percent of the children's width / height
 *    shiftTooltipPercent? - shifts the tooltip, by a percent of the tooltip's width / height
 *    fadeEffect?    - plays the default fade in / out animation, default true
 *    closingTime?   - the time it takes for the tooltip to close, in ms
 *    boundaryDetection? - moves the tooltip if it goes out of bounds of the portalTarget, default true
 *    ariaLabelChildren? - the aria label for the children
 *    focusable         - default true, allows tooltip to appear on tab navigation
 */
interface HoverTooltipPortalProps {
  children: React.ReactNode;
  tooltip: React.ReactNode;
  tooltipId: string;
  direction: Direction;
  portalTargetRef: React.RefObject<HTMLElement>;
  anchorRef?: React.RefObject<HTMLElement>;
  offset?: number;
  shiftRem?: number;
  shiftChildPercent?: number;
  shiftTooltipPercent?: number;
  fadeEffect?: boolean;
  closingTime?: number;
  boundaryDetection?: boolean;
  ariaLabelChildren?: string;
  focusable?: boolean;
}

type Side = "top" | "right" | "bottom" | "left";
type Align = "left" | "right" | "top" | "bottom" | "middle";
type Direction =
  | "top"
  | "top-left"
  | "top-right"
  | "bottom"
  | "bottom-left"
  | "bottom-right"
  | "left"
  | "left-top"
  | "left-bottom"
  | "right"
  | "right-top"
  | "right-bottom";

// Splits the direction into a side and an alignment
function parseDirection(direction: Direction): { side: Side; align: Align } {
  const [side, align] = direction.split("-") as [Side, Align?];
  return {
    side: side,
    align: align ?? "middle",
  };
}

const positionObject = {
  transform: "",
};

export default function HoverTooltipPortal({
  children,
  tooltip,
  direction,
  portalTargetRef,
  tooltipId,
  anchorRef,
  offset = 0.0,
  shiftRem = 0.0,
  shiftChildPercent = 0,
  shiftTooltipPercent = 0,
  fadeEffect = true,
  closingTime = 300,
  boundaryDetection = true,
  ariaLabelChildren = "Hover to reveal tooltip",
  focusable = true,
}: HoverTooltipPortalProps) {
  const [active, setActive] = useState(false);
  const [closing, setClosing] = useState(false);

  const childrenRef = useRef<null | HTMLDivElement>(null);
  const tooltipRef = useRef<null | HTMLDivElement>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  //Clears the timer
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Adds the tooltip
  function addTooltip() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setClosing(false);
    setActive(true);
  }
  // Removes the tooltip
  function removeTooltip() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setClosing(true);
    timerRef.current = setTimeout(() => {
      setActive(false);
      setClosing(false);
    }, closingTime);
  }

  //Adds the tooltip if the child element is focused or hovered over, removes otherwise
  function updateTooltipStatus() {
    const isFocused = focusable
      ? childrenRef.current?.matches(":focus-visible") ||
        !!childrenRef.current?.querySelector(":focus-visible")
      : false;
    const isHovered = childrenRef.current?.matches(":hover");
    const isNotHovered = !tooltipRef.current?.matches(":hover");
    if (isFocused || (isHovered && isNotHovered)) {
      addTooltip();
    } else {
      removeTooltip();
    }
  }

  //Moves the tooltip to one of the sides when it becomes active, adds events for positioning
  useEffect(() => {
    if (active) {
      calculatePosition();
      window.addEventListener("resize", throttledCalculatePosition);
      window.addEventListener("scroll", throttledCalculatePosition);
      return () => {
        window.removeEventListener("resize", throttledCalculatePosition);
        window.removeEventListener("scroll", throttledCalculatePosition);
      };
    }
  }, [active]);

  // Calculates the position of the tooltip when the window is resized
  const throttledCalculatePosition = useCallback(
    throttle(() => {
      calculatePosition();
    }, 100),
    []
  );

  // Watches the portal target for changes in size, and recalculates the position
  useEffect(() => {
    if (!portalTargetRef?.current) return;
    const observer = new ResizeObserver(() => {
      calculatePosition();
    });
    observer.observe(portalTargetRef.current);
    return () => observer.disconnect();
  }, [portalTargetRef]);

  //Calculate the position for the tooltip to appear
  function calculatePosition() {
    if (
      !tooltipRef.current ||
      !childrenRef.current ||
      !portalTargetRef ||
      !portalTargetRef.current
    )
      return;
    const positionCopy = { ...positionObject };
    const { side, align } = parseDirection(direction);

    // Boolean to check if tooltip appears vertically or horizontally
    const verticalDirection = side === "top" || side === "bottom";

    // Keeps track of our translate values
    const translates = { x: 0, y: 0 };

    //Handles the offset
    if (offset) {
      translates[verticalDirection ? `y` : `x`] =
        side === "top" || side === "left" ? -1 * offset : offset;
    }

    let tooltip = tooltipRef.current.getBoundingClientRect();
    //Uses a different anchor element if provided
    const child =
      anchorRef && anchorRef.current
        ? anchorRef.current.getBoundingClientRect()
        : childrenRef.current.getBoundingClientRect();
    const container = portalTargetRef.current.getBoundingClientRect();

    // Moves the tooltip to the edge of the child element, in its correct vert / horz position
    const anchorPoints: Record<
      "top" | "right" | "bottom" | "left",
      () => void
    > = {
      top: () => {
        translates.y += (child.top - container.top - tooltip.height) / 10;
      },
      right: () => {
        translates.x += (child.right - container.left) / 10;
      },
      bottom: () => {
        translates.y += (child.bottom - container.top) / 10;
      },
      left: () => {
        translates.x += (child.left - container.left - tooltip.width) / 10;
      },
    };
    anchorPoints[side]();

    //Handles the alignment
    const alignments: Record<
      "top" | "right" | "bottom" | "left" | "middle",
      () => void
    > = {
      top: () => {
        translates.y += (child.top - container.top) / 10;
      },
      right: () => {
        translates.x += (child.right - container.left - tooltip.width) / 10;
      },
      bottom: () => {
        translates.y += (child.bottom - container.top - tooltip.height) / 10;
      },
      left: () => {
        translates.x += (child.left - container.left) / 10;
      },
      middle: () => {
        verticalDirection
          ? (translates.x +=
              (child.left + child.right - tooltip.width) / 20 -
              container.left / 10)
          : (translates.y +=
              (child.top + child.bottom - tooltip.height) / 20 -
              container.top / 10);
      },
    };
    alignments[align]();

    //Handles the shifts
    if (shiftChildPercent) {
      translates[verticalDirection ? `x` : `y`] += verticalDirection
        ? (child.width * shiftChildPercent) / 1000
        : (child.height * shiftChildPercent) / 1000;
    }

    if (shiftTooltipPercent) {
      translates[verticalDirection ? `x` : `y`] += verticalDirection
        ? (tooltip.width * shiftTooltipPercent) / 1000
        : (tooltip.height * shiftTooltipPercent) / 1000;
    }

    if (shiftRem) {
      translates[verticalDirection ? `x` : `y`] += shiftRem;
    }

    positionCopy.transform = `translateX(${translates.x}rem) translateY(${translates.y}rem)`;

    if (boundaryDetection) {
      // Moves tooltip if it goes outside the container's bounds
      Object.assign(tooltipRef.current.style, positionCopy);
      tooltip = tooltipRef.current.getBoundingClientRect();
      if (verticalDirection) {
        //Moves tooltip to the bottom if it goes out of bounds to the top
        if (side === "top") {
          if (tooltip.top < container.top || tooltip.top < -child.height / 8) {
            translates.y += (child.height + tooltip.height) / 10;
            if (offset) {
              translates.y += 2 * offset;
            }
          }
        }
        // Moves tooltip right / left if it goes out of bounds to right / left
        let translateX = 0;
        if (tooltip.right > container.right) {
          translateX = container.right - tooltip.right;
        }
        if (tooltip.left + translateX < container.left) {
          translateX = container.left - tooltip.left;
        }
        translates.x += translateX / 10;
      } else {
        // Moves tooltip to the bottom if it goes out of bounds to right / left
        if (tooltip.left < container.left || tooltip.right > container.right) {
          translates.x = 0;
          translates.y = 0;
          if (offset) {
            translates.y += offset;
          }
          anchorPoints[`bottom`]();
          translates.x +=
            (child.left + child.right - tooltip.width) / 20 -
            container.left / 10;
          positionCopy.transform = `translateX(${translates.x}rem) translateY(${translates.y}rem)`;
          Object.assign(tooltipRef.current.style, positionCopy);
          tooltip = tooltipRef.current.getBoundingClientRect();
          let translateX = 0;
          if (tooltip.right > container.right) {
            translateX = container.right - tooltip.right;
          }
          if (tooltip.left + translateX < container.left) {
            translateX = container.left - tooltip.left;
          }
          translates.x += translateX / 10;
        } else {
          // Moves tooltip up / down if it goes out of bounds to top / bottom
          let translateY = 0;
          if (tooltip.bottom > container.bottom) {
            translateY = container.bottom - tooltip.bottom;
          }
          if (tooltip.top + translateY < container.top) {
            translateY = container.top - tooltip.top;
          }
          translates.y += translateY / 10;
        }
      }
      positionCopy.transform = `translateX(${translates.x}rem) translateY(${translates.y}rem)`;
    }
    Object.assign(tooltipRef.current.style, positionCopy);
  }

  // Tells the tooltip to play its closing animation by using the triggerCloseAnimation prop
  // This has to be set up in the tooltip component
  tooltip = React.isValidElement(tooltip)
    ? React.cloneElement(
        tooltip as React.ReactElement<{ triggerCloseAnimation?: boolean }>,
        {
          triggerCloseAnimation: closing,
        }
      )
    : tooltip;

  return (
    <>
      <div
        ref={childrenRef}
        aria-expanded={active}
        tabIndex={focusable ? 0 : undefined}
        onMouseEnter={updateTooltipStatus}
        onMouseLeave={updateTooltipStatus}
        onFocus={focusable ? updateTooltipStatus : undefined}
        onBlur={focusable ? updateTooltipStatus : undefined}
        className={styles.expandable}
        aria-label={ariaLabelChildren}
        aria-describedby={tooltipId}
      >
        {children}
      </div>
      {active &&
        portalTargetRef &&
        createPortal(
          <div
            className={classNames(styles.tooltip_wrapper, {
              [styles.appear]: fadeEffect,
              [styles.closing]: closing && fadeEffect,
            })}
            ref={tooltipRef}
            id={tooltipId}
            tabIndex={0}
          >
            {tooltip}
          </div>,
          portalTargetRef.current as HTMLElement
        )}
    </>
  );
}

"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./badge.module.css";
import classNames from "classnames";

/*  Adds a badge over an element
 *    children       - the elements which the badge is attached to
 *    badge          - the inputed badge that will be displayed
 *    direction      - the direction in which the badge will appear
 *    align          - the alignment of the badge relative to the children, should be perpendicular to "direction"
 *    offsetRem?     - the offset of the badge in rem
 *    offsetBadgePercent?     - the offset of the badge, by a percent of the badge's width / height, 0 to 100
 *    offsetChildrenPercent?  - the offset of the badge, by a percent of the children's width / height, 0 to 100
 *    shiftRem?               - shifts the panel in rem
 *    shiftBadgePercent?      - shifts the panel, by a percent of the badge's width / height, 0 to 100
 *    shiftChildrenPercent?   - shifts the panel, by a percent of the children's width / height, 0 to 100
 */
interface BadgeProps {
  children: React.ReactNode;
  badge: React.ReactNode;
  direction: Direction;
  offsetRem?: number;
  offsetBadgePercent?: number;
  offsetChildrenPercent?: number;
  shiftRem?: number;
  shiftChildrenPercent?: number;
  shiftBadgePercent?: number;
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

export default function Badge({
  children,
  badge,
  direction,
  offsetRem = 0,
  offsetBadgePercent = 0,
  offsetChildrenPercent = 0,
  shiftRem = 0,
  shiftChildrenPercent = 0,
  shiftBadgePercent = 0,
}: BadgeProps) {
  const position = {
    top: ``,
    left: ``,
    right: ``,
    bottom: ``,
    transform: ``,
  };

  calculatePosition();

  //Calculate the position for the badge to appear
  function calculatePosition() {
    const { side, align } = parseDirection(direction);
    // Boolean to check if badge direction is vertically or horizontal
    const verticalDirection = side === "top" || side === "bottom";

    const translates = {
      remX: 0,
      remY: 0,
      percentX: 0,
      percentY: 0,
    };

    // Moves the panel to one of the sides
    position[side] = `0rem`;
    translates[verticalDirection ? `percentY` : `percentX`] +=
      side === "top" || side === "left" ? -100 : 100;

    // Handles the offsets
    if (offsetRem) {
      translates[verticalDirection ? `remY` : `remX`] += offsetRem;
    }
    if (offsetBadgePercent) {
      translates[verticalDirection ? `percentY` : `percentX`] +=
        offsetBadgePercent;
    }
    if (offsetChildrenPercent) {
      position[side] =
        side === "top" || side === "left"
          ? `${offsetChildrenPercent}%`
          : `${offsetChildrenPercent * -1}%`;
    }

    //Handles the alignment and shiftChildPercent
    if (align === "middle") {
      // Aligns the panel to the center
      position[verticalDirection ? `left` : `top`] = `${
        50 + shiftChildrenPercent
      }%`;
      translates[verticalDirection ? `percentX` : `percentY`] += -50;
    } else {
      // Aligns the panel to a side
      position[align] = `${
        (align === "top" || align === "left" ? 1 : -1) * shiftChildrenPercent
      }%`;
    }

    // Shifts the panel
    if (shiftRem) {
      translates[verticalDirection ? `remX` : `remY`] += shiftRem;
    }
    if (shiftBadgePercent) {
      translates[verticalDirection ? `percentX` : `percentY`] +=
        shiftBadgePercent;
    }
    position.transform = `translateX(${translates.remX}rem) translateY(${translates.remY}rem) translateX(${translates.percentX}%) translateY(${translates.percentY}%)`;
  }

  return (
    <div className={styles.wrapper}>
      {children}
      <div
        className={classNames(styles.badge)}
        style={{
          ...position,
        }}
      >
        {badge}
      </div>
    </div>
  );
}

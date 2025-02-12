"use client";
import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import styles from "./rating.module.css";

/*
 **  maxRating - the maximum number of stars the item being rated will have
 **  rated     - boolean if the item has been rated previously
 **  rating    - rating of an item that has been rated previously
 **  itemId    - the id of the item that being rated
 */
interface RatingProps {
  maxRating?: number;
  rated?: boolean;
  rating?: number;
  itemId?: string;
}

const emptyStar = (fillColor: string) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 67 63"
    className={classNames(styles.emptyStar, styles[fillColor])}
  >
    <path d="m33 10.822 5.797 11.746 1.163 2.357 2.602.378 12.963 1.884-9.38 9.143-1.882 1.835.444 2.591 2.214 12.91-11.594-6.096L33 46.348l-2.327 1.223-11.594 6.096 2.214-12.91.444-2.591-1.882-1.835-9.38-9.143 12.962-1.884 2.602-.378 1.163-2.357L33 10.822M33-.475l-10.281 20.83L-.27 23.696 16.365 39.91l-3.927 22.896L33 51.996l20.562 10.811-3.927-22.897L66.27 23.696l-22.99-3.341L33-.475z" />
  </svg>
);

const fullStar = (fillColor: string) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={37}
    height={35}
    viewBox="0 0 37 35"
    className={classNames(styles.fullStar, styles[fillColor])}
  >
    <path d="m19 .791 5.646 11.438 12.624 1.835-9.135 8.904 2.156 12.573L19 29.604 7.709 35.541l2.156-12.573L.73 14.064l12.624-1.835z" />
  </svg>
);

export default function Rating({
  maxRating = 5,
  rated = false,
  rating = 0,
  itemId,
}: RatingProps) {
  const [isRated, setIsRated] = useState(rated);
  const [currentRating, setCurrentRating] = useState(rating);
  const [stars, setStars] = useState<JSX.Element[] | null>(null);
  const starsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    rated ? prevRated() : unrated();
  }, []);

  // Generates the stars for a fresh unrated item
  function unrated() {
    const starsArr: JSX.Element[] = [];
    for (let i = 0; i < maxRating; i++) {
      starsArr.push(
        <button
          key={i}
          onMouseOver={(e) => choosing(e, i)}
          onFocus={(e) => choosing(e, i)}
          aria-label={`Rate ${
            i + 1
          } out of ${maxRating}. Use arrow keys or numbers to change your selection.`}
        >
          {emptyStar("unrated")}
        </button>
      );
    }
    setStars(starsArr);
  }

  // Generates the stars for a previously rated item
  function prevRated() {
    const starsArr: JSX.Element[] = [];
    for (let i = 0; i <= rating; i++) {
      starsArr.push(
        <button
          key={i}
          ref={(el) => {
            starsRef.current[i] = el;
          }}
          onClick={(e) => choosing(e, i)}
          aria-label={`You rated this ${rating} out of ${maxRating}. Click to change your rating.`}
        >
          {fullStar("gold")}
        </button>
      );
    }
    for (let i = rating + 1; i < maxRating; i++) {
      starsArr.push(
        <button
          key={i}
          ref={(el) => {
            starsRef.current[i] = el;
          }}
          onClick={(e) => choosing(e, i)}
          aria-label={`You rated this ${rating} out of ${maxRating}. Click to change your rating.`}
        >
          {emptyStar("black")}
        </button>
      );
    }
    setStars(starsArr);
  }

  // Generates stars for a newly rated item and updates the backend
  async function finishRating(
    e: React.MouseEvent<HTMLButtonElement> | null,
    rating: number
  ) {
    setIsRated(true);
    setCurrentRating(rating);
    const starsArr: JSX.Element[] = [];
    for (let i = 0; i < rating; i++) {
      starsArr.push(
        <button
          key={i}
          ref={(el) => {
            starsRef.current[i] = el;
          }}
          onClick={(e) => choosing(e, i)}
          aria-label={`You rated this ${rating} out of ${maxRating}. Click to change your rating.`}
        >
          {fullStar("gold")}
        </button>
      );
    }
    for (let i = rating; i < maxRating; i++) {
      starsArr.push(
        <button
          key={i}
          ref={(el) => {
            starsRef.current[i] = el;
          }}
          onClick={(e) => choosing(e, i)}
          aria-label={`You rated this ${rating} out of ${maxRating}. Click to change your rating.`}
        >
          {emptyStar("black")}
        </button>
      );
    }
    setStars(starsArr);
    //Sets the rating on the backend
    const res = await fetch(`/api/rating/updateRating/`, {
      body: JSON.stringify({ itemId: itemId, rating: rating }),
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
  }

  // Generates stars when choosing a rating
  function choosing(
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.FocusEvent<HTMLButtonElement>,
    rating: number
  ) {
    setIsRated(false);
    const starsArr: JSX.Element[] = [];
    for (let i = 0; i <= rating; i++) {
      starsArr.push(
        <button
          key={i}
          ref={(el) => {
            starsRef.current[i] = el;
          }}
          onMouseOver={(e) => choosing(e, i)}
          onFocus={(e) => choosing(e, i)}
          onClick={(e) => finishRating(e, i + 1)}
          aria-label={`Rate ${
            i + 1
          } out of ${maxRating}. Use arrow keys or numbers to change your selection.`}
        >
          {fullStar("pending")}
        </button>
      );
    }
    for (let i = rating + 1; i < maxRating; i++) {
      starsArr.push(
        <button
          key={i}
          ref={(el) => {
            starsRef.current[i] = el;
          }}
          onMouseOver={(e) => choosing(e, i)}
          onFocus={(e) => choosing(e, i)}
          aria-label={`Rate ${
            i + 1
          } out of ${maxRating}. Use arrow keys or numbers to change your selection.`}
        >
          {emptyStar("black")}
        </button>
      );
    }
    setStars(starsArr);
  }

  //Lets user enter a number for their rating
  function handleKeydown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!isRated) {
      if (e.key === "ArrowLeft") {
        let index =
          starsRef.current.findIndex((ref) => ref === document.activeElement) -
          1;
        if (index >= 0) {
          starsRef.current[index]?.focus();
        }
      } else if (e.key === "ArrowRight") {
        let index =
          starsRef.current.findIndex((ref) => ref === document.activeElement) +
          1;
        if (index < maxRating) {
          starsRef.current[index]?.focus();
        }
      } else {
        const key = Number(e.key);
        if (key >= 1 && key <= maxRating) {
          starsRef.current[key - 1]?.focus();
        }
      }
    }
  }

  return (
    <div
      className={styles.rating}
      onMouseLeave={() => {
        isRated ? null : unrated();
      }}
      onBlur={() => {
        isRated ? null : unrated();
      }}
      onKeyDown={handleKeydown}
      tabIndex={0}
      role="group"
    >
      {stars}
    </div>
  );
}

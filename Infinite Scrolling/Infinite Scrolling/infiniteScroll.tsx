"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import styles from "./infiniteScroll.module.css";
import classNames from "classnames";
import Button from "../Buttons/Button Set 1/button";

export default function InfiniteScroll() {
  const [items, setItems] = useState<{}[]>([]);
  const [isError, setIsError] = useState(false);
  const [sort, setSort] = useState("newest");
  const lastItemDataRef = useRef({});
  function setLastItemDataRef(point: {}) {
    lastItemDataRef.current = point;
  }

  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      getItems();
    }
  }, [sort]);

  //Fetches items from the backend
  const getItems = useCallback(async () => {
    try {
      const res = await fetch(`/api/infiniteScroll`, {
        method: "POST",
        body: JSON.stringify({
          sort,
          lastItem: lastItemDataRef.current,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (0 == Math.floor(Math.random() * 3)) throw new Error();
      if (data.errors) throw new Error();
      setItems((prev) => [...prev, ...data.items]);
      if (data.lastItem) {
        setLastItemDataRef(data.lastItem);
      }
      if (isError) setIsError(false);
    } catch (error) {
      setIsError(true);
    }
  }, [sort, lastItemDataRef.current]);

  // Create an observer on the last item
  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useCallback(
    (node: HTMLLIElement) => {
      if (!node) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) getItems();
        },
        { rootMargin: "200px" }
      );
      observer.current.observe(node);
    },
    [getItems]
  );

  //Creates the sort menu at the top of component
  function sortOptions() {
    const sortLink = (text: string, sortOption: string, key: string) => {
      return (
        <button
          key={key}
          className={classNames(styles.sort_option, {
            [styles.active]: sort === sortOption,
          })}
          onClick={
            sort === sortOption
              ? () => {}
              : () => {
                  setItems([]);
                  setLastItemDataRef({});
                  setSort(sortOption);
                }
          }
          aria-label={`Sort by ${sortOption}`}
        >
          {text}
        </button>
      );
    };
    return (
      <div className={styles.sort_options} aria-label="Sort options">
        {["Newest", "Oldest", "Popular", "Best"].map((option) =>
          sortLink(option, option.toLowerCase(), option.toLowerCase())
        )}
      </div>
    );
  }

  //Creates the items displayed on the page
  function pageItems() {
    return (
      <ul className={styles.items_container} role="list">
        {items.map((item: any, i: number) => {
          let pathName: string = item.fileName?.split(".jpg")[0];
          let date = new Date(item.dateCreated);
          let dateString = date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });

          return (
            <li
              key={i}
              role="listitem"
              ref={i === items.length - 1 ? lastItemRef : null}
            >
              <div
                className={styles.link_container}
                style={{
                  backgroundImage: `url(${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_DOMAIN}/images/wallpapers/${item.fileName})`,
                }}
              >
                <Link href={`/infinite/${pathName}`}></Link>
              </div>
              <div className={styles.item_info}>
                <div>
                  <div className={styles.info_label}>{`Views:`}</div>
                  <div>{`${item.viewCount}`}</div>
                </div>
                <div>
                  <div className={styles.info_label}>{`Rating:`}</div>
                  <div>{`${item.rating}`}</div>
                </div>
                <div>
                  <div className={styles.info_label}>{`Posted:`}</div>
                  <div>{`${dateString}`}</div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  return isError ? (
    <div className={styles.infinite}>
      <div className={styles.sort_options_container}>{sortOptions()}</div>
      {pageItems()}
      <div className={styles.error_container}>
        <div
          className={styles.error_message}
        >{`Something went wrong additional items...`}</div>
        <Button text="Retry" type="secondary" onClick={getItems} />
      </div>
    </div>
  ) : (
    <div className={styles.infinite}>
      <div className={styles.sort_options_container}>{sortOptions()}</div>
      {pageItems()}
    </div>
  );
}

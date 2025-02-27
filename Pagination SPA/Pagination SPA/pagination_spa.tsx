"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./pagination_spa.module.css";
import classNames from "classnames";
import Button from "../Buttons/Button Set 1/button";

//A single page application version of pagination
export default function PaginationSpa() {
  const DEFAULT_PAGE_SIZE = 12;
  const DEFAULT_SORT = "newest";
  const [items, setItems] = useState<{}[]>([]);
  const [page, setPage] = useState(1);
  const [isError, setIsError] = useState(false);
  const [numPages, setNumPages] = useState(0);
  const [sort, setSort] = useState("");
  const [pageSize, setPageSize] = useState<number | null>();
  const [pageInputValue, setPageInputValue] = useState("");

  useEffect(() => {
    getItems();
  }, [page, pageSize]);

  useEffect(() => {
    getItems(true);
  }, [sort]);

  //Fetches items from the backend
  async function getItems(changedSort?: boolean) {
    try {
      let params: string[] = [];
      if (page !== 1 && !changedSort) params.push(`page=${page}`);
      if (pageSize !== DEFAULT_PAGE_SIZE) params.push(`pagesize=${pageSize}`);
      if (sort !== DEFAULT_SORT) params.push(`sort=${sort}`);
      const queryString = params.toString() ? `?${params.join("&")}` : "";
      const res = await fetch(`/api/pagination_spa${queryString}`);
      const data = await res.json();
      if (data.errors) throw new Error();
      //if (0 == Math.floor(Math.random() * 3)) throw new Error();
      setItems(data.items);
      setPage(data.page);
      setNumPages(data.numPages);
      setSort(data.sort);
      setPageSize(data.pageSize);
      if (isError) setIsError(false);
    } catch (error) {
      setIsError(true);
    }
  }

  //Creates a menu for changing page size at the top of the component
  function sizeOptions() {
    const pageSizeButton = (text: string, newPageSize: number) => {
      return (
        <button
          key={newPageSize}
          className={classNames(styles.size_option, {
            [styles.active]: pageSize === newPageSize,
          })}
          aria-label={`Change page size to ${newPageSize} items`}
          onClick={() => {
            setPageSize(newPageSize);
          }}
        >
          {text}
        </button>
      );
    };
    const pageSizesArr: JSX.Element[] = [
      pageSizeButton("12", 12),
      pageSizeButton("24", 24),
      pageSizeButton("36", 36),
    ];
    return (
      <div className={styles.size_options} aria-label="Page size options">
        {pageSizesArr}
      </div>
    );
  }

  //Creates the sort menu at the top of component
  function sortOptions() {
    const sortButton = (text: string, sortOption: string, key: string) => {
      return (
        <button
          key={key}
          className={classNames(styles.sort_option, {
            [styles.active]: sort === sortOption,
          })}
          aria-label={`Sort by ${sortOption}`}
          onClick={() => {
            setSort(sortOption);
          }}
        >
          {text}
        </button>
      );
    };
    const sortOptionsArr: JSX.Element[] = [
      sortButton("Newest", "newest", "newest"),
      sortButton("Oldest", "oldest", "oldest"),
      sortButton("Popular", "popular", "popular"),
      sortButton("Best", "best", "best"),
    ];
    return (
      <div className={styles.sort_options} aria-label="Sort options">
        {sortOptionsArr}
      </div>
    );
  }

  //Creates the pagination menu
  function paginationMenu() {
    const menuLink = (
      text: string,
      page: number,
      key: string,
      className?: string,
      ariaLabel?: string
    ) => {
      return (
        <button
          key={key}
          className={styles[className || ``]}
          aria-label={ariaLabel ? ariaLabel : `Go to page ${page}`}
          onClick={() => setPage(page)}
        >
          {text}
        </button>
      );
    };
    const menuArr: JSX.Element[] = [];
    const range = 2; //The +/- range for clickable pages from the one you're on

    let startPage = Math.max(page - range, 1);
    let endPage = Math.min(page + range, numPages);
    if (startPage == 1) {
      endPage = Math.min(1 + 2 * range, numPages);
    }
    if (endPage == numPages) {
      startPage = Math.max(numPages - 2 * range, 1);
    }
    if (page > 1) {
      menuArr.push(
        menuLink("<", page - 1, "left-arrow", "arrow", "Previous page")
      );
    }
    if (page > 1 + range && numPages > 2 * range + 1) {
      menuArr.push(menuLink("1", 1, `page-1`));
      if (startPage > 2) {
        menuArr.push(
          <div
            className={styles.ellipsis}
            key="left-ellipsis"
            aria-hidden={true}
          >
            {`...`}
          </div>
        );
      }
    }
    for (let i = startPage; i <= endPage; i++) {
      i === page
        ? menuArr.push(
            <div
              className={styles.current_page}
              key={`page-${page}`}
              aria-current="page"
            >
              {page}
            </div>
          )
        : menuArr.push(menuLink(`${i}`, i, `page-${i}`));
    }
    if (page < numPages - range && numPages > 2 * range + 1) {
      if (endPage < numPages - 1) {
        menuArr.push(
          <div
            className={styles.ellipsis}
            key="right-ellipsis"
            aria-hidden={true}
          >
            {`...`}
          </div>
        );
      }
      menuArr.push(menuLink(`${numPages}`, numPages, `page-${numPages}`));
    }
    if (page < numPages) {
      menuArr.push(
        menuLink(">", page + 1, "right-arrow", "arrow", "Next Page")
      );
    }
    return (
      <nav className={styles.pagination_menu} aria-label="Pagination">
        {menuArr}
      </nav>
    );
  }

  //Creates the items displayed on the page
  function pageItems() {
    return (
      <ul className={styles.items_container} role="list">
        {items.map((item: any, i: number) => {
          let pathName: string = item.fileName.split(".jpg")[0];
          let date = new Date(item.dateCreated);
          let dateString = date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
          return (
            <li key={i} role="listitem">
              <button
                className={styles.link_container}
                style={{
                  backgroundImage: `url(${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_DOMAIN}/images/wallpapers/${item.fileName})`,
                }}
                onClick={() => {
                  /* Some function that displays our item*/
                }}
              ></button>
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
    <div className={styles.pagination}>
      <div className={styles.options_container}>
        {sizeOptions()}
        {sortOptions()}
      </div>
      <div className={styles.error_container}>
        <div
          className={styles.error_message}
        >{`This content couldn't be shown to you at this time.`}</div>
        <Button text="Retry" type="secondary" onClick={getItems} />
      </div>
    </div>
  ) : numPages ? (
    <div className={styles.pagination}>
      <div className={styles.options_container}>
        {sizeOptions()}
        {sortOptions()}
      </div>
      {pageItems()}
      <div className={styles.pagination_menu_container}>
        {paginationMenu()}
        <form
          className={styles.page_input}
          onSubmit={(e) => {
            e.preventDefault();
            setPage(Number(pageInputValue));
            setPageInputValue("");
          }}
        >
          <label htmlFor="page-input">{`Go to page:`}</label>
          <input
            id="page-input"
            name="page-input"
            type="text"
            value={pageInputValue}
            onChange={(e) => setPageInputValue(e.target.value)}
            aria-label="Input a page number and hit Enter to navigate"
          />
        </form>
      </div>
    </div>
  ) : null;
}

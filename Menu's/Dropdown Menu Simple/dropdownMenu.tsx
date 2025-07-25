"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./dropdownMenu.module.css";
import { useRouter } from "next/navigation";
import classNames from "classnames";

// A menu item that is a link
export interface LinkItem {
  type: "link";
  label: string;
  href: string;
}
// Performs a function when you click on this menu item
export interface ActionItem {
  type: "action";
  label: string;
  onClick: () => void;
}

// Lets us add a divider line or a blank space to our menu
export interface Decoration {
  type: "decoration";
  decoration: "line" | "space";
}
export type Item = LinkItem | ActionItem | Decoration;

/* Used to create each item in the menu
 *  item - the inputed MenuItem: ActionMenuItem | LinkMenuItem |  DecorationMenuItem;
 *  itemRef - an entry from itemsRef to keep track of actionable items vs decorations
 *  onClose - the functions that hides visibility
 *  index - the index we get from the map when creating a menu
 *  parent - a ref to the parent menuItem of this item
 *  siblings - an array ref of the siblings of this item
 *  direction - the direction the menu will face in (affects arrows and keyboard inputs)
 * */
interface MenuItemProps {
  item: Item;
  itemRef: React.RefObject<HTMLLIElement>;
  onClose: () => void;
  index: number;
  siblings?: React.RefObject<HTMLLIElement>[];
  direction?: "right" | "left";
}
export function Item({
  item,
  itemRef,
  onClose,
  index,
  siblings,
  direction,
}: MenuItemProps) {
  const router = useRouter();

  //Gives time for closing animation to play
  const [closing, setClosing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const closingTime = 150;
  useEffect(() => {
    if (closing) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        setClosing(false);
      }, closingTime);
    }
  }, [closing]);

  function handleMouseEnter() {
    if (itemRef.current?.matches(":hover")) {
      itemRef.current.focus();
    }
  }

  function handleBlur() {
    const isItemFocused =
      itemRef.current?.matches(":focus") ||
      itemRef.current?.querySelector(":focus");
    if (!isItemFocused) {
      setClosing(true);
    }
  }

  function handleKeydownAction(e: React.KeyboardEvent<HTMLLIElement>) {
    if (
      e.key === "ArrowUp" ||
      e.key === "ArrowRight" ||
      e.key === "ArrowDown" ||
      e.key === "ArrowLeft"
    ) {
      e.preventDefault();
    }
    e.stopPropagation();
    if (e.key === "Enter" && item.type === "action") {
      item.onClick();
      onClose();
    } else {
      switch (e.key) {
        case "ArrowDown": {
          if (siblings && index + 1 < siblings.length) {
            siblings[index + 1].current?.focus();
          }
          break;
        }
        case "ArrowUp": {
          if (index > 0 && siblings) {
            siblings[index - 1].current?.focus();
          }
          break;
        }
        case "Escape": {
          onClose();
        }
        case "Escape": {
          onClose();
        }
        default: {
        }
      }
    }
  }

  function handleKeydownLink(
    e: React.KeyboardEvent<HTMLLIElement>,
    href: string
  ) {
    if (
      e.key === "ArrowUp" ||
      e.key === "ArrowRight" ||
      e.key === "ArrowDown" ||
      e.key === "ArrowLeft"
    ) {
      e.preventDefault();
    }
    e.stopPropagation();
    switch (e.key) {
      case "ArrowDown": {
        if (siblings && index + 1 < siblings.length) {
          siblings[index + 1].current?.focus();
        }
        break;
      }
      case "ArrowUp": {
        if (index > 0 && siblings) {
          siblings[index - 1].current?.focus();
        }
        break;
      }
      case "Enter": {
        router.push(href);
      }
      case "Escape": {
        onClose();
        break;
      }
      case "Backspace": {
        onClose();
        break;
      }
      default: {
      }
    }
  }

  // Renders the item
  switch (item.type) {
    case "link":
      return (
        <li
          tabIndex={0}
          onMouseEnter={handleMouseEnter}
          onBlur={() => setTimeout(handleBlur, 0)}
          onKeyDown={(e) => handleKeydownLink(e, item.href)}
          ref={itemRef}
          role="menuitem"
          aria-label={`Click or press Enter to go to "${item.label}"`}
        >
          <Link href={item.href} tabIndex={-1}>
            {item.label}
          </Link>
        </li>
      );
    case "decoration":
      return item.decoration === "line" ? (
        <div className={styles.line} />
      ) : (
        <div className={styles.space} />
      );
    case "action":
      return (
        <li
          role="menuitem"
          tabIndex={0}
          ref={itemRef}
          onMouseEnter={() => itemRef.current?.focus()}
          onClick={() => {
            item.onClick();
            onClose();
          }}
          onKeyDown={handleKeydownAction}
        >
          <div className={styles.li_content_wrapper}>
            <div className={styles.label}>{item.label}</div>
          </div>
        </li>
      );
    default:
      return null;
  }
}

interface DropdownMenuProps {
  label: string;
  menu: Item[];
  containerRef?: React.RefObject<HTMLElement>;
}
export default function DropdownMenu({
  label,
  menu,
  containerRef,
}: DropdownMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [direction, setDirection] = useState<"left" | "right" | undefined>();
  const menuRef = useRef<HTMLUListElement | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  //Gives time for closing animation to play
  const [closing, setClosing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const closingTime = 150;
  useEffect(() => {
    if (closing) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        setMenuOpen(false);
        setClosing(false);
      }, closingTime);
    }
  }, [closing]);
  function openMenu() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setClosing(false);
    setMenuOpen(true);
  }

  //Adds event listeners when menu opens, removes them when it closes
  useEffect(() => {
    if (!menuRef.current || !menuOpen) {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", escapeKey);
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      return;
    }
    if (containerRef && containerRef.current) {
      observerRef.current = new ResizeObserver(() => {
        positionMenu();
      });
      observerRef.current.observe(containerRef.current);
    } else {
      positionMenu();
    }
    document.addEventListener("click", handleClick);
    window.addEventListener("keydown", escapeKey);
  }, [menuOpen]);

  //Poition the menu so it doesn't go out of bounds
  function positionMenu() {
    if (!menuRef.current || !menuOpen) {
      return;
    }
    const menu = menuRef.current.getBoundingClientRect();
    //This centers the menu but we could position it differently
    const centerTranslate = -menu.width / 2;
    let transform = `translateX(${centerTranslate / 10}rem)`;
    Object.assign(menuRef.current.style, { transform: transform });
    if (containerRef && containerRef.current) {
      const menu = menuRef.current.getBoundingClientRect();
      const container = containerRef.current.getBoundingClientRect();
      const translates = {
        x: 0,
        y: 0,
      };
      if (menu.right > container.right) {
        translates.x += container.right - menu.right;
      }
      if (menu.left + translates.x < container.left) {
        translates.x += container.left - (menu.left + translates.x);
      }
      translates.x += centerTranslate;
      transform = `translateX(${translates.x / 10}rem) translateY(${
        translates.y / 10
      }rem)`;
      Object.assign(menuRef.current.style, { transform: transform });
    }
  }

  //Closes the menu when user hits Escape
  const escapeKey = useCallback(
    (e: KeyboardEvent | globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        setClosing(true);
      }
    },
    []
  );

  //Closes the menu when user clicks something else
  const handleClick = useCallback((e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setClosing(true);
    }
  }, []);

  const actionableIndexes = menu
    .map((item, i) => (item.type !== "decoration" ? i : null))
    .filter((i): i is number => i !== null);

  const itemRefs = useRef<Array<React.RefObject<HTMLLIElement>>>(
    actionableIndexes.map(() => React.createRef<HTMLLIElement>())
  );

  function handleButtonKeydown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (
      e.key === "ArrowUp" ||
      e.key === "ArrowRight" ||
      e.key === "ArrowDown" ||
      e.key === "ArrowLeft"
    ) {
      e.preventDefault();
    }
    if (e.key === "ArrowDown") {
      itemRefs.current[0].current?.focus();
    }
  }

  return (
    <div
      className={classNames(styles.dropdown_menu_wrapper, {
        [styles.closing]: closing,
      })}
    >
      <button
        onClick={() => {
          menuOpen ? setClosing(true) : openMenu();
        }}
        onKeyDown={handleButtonKeydown}
        aria-haspopup="true"
        aria-expanded={menuOpen}
        aria-label={`Click to ${menuOpen ? `close` : `open`} dropdown menu`}
      >
        {label}
      </button>
      {menuOpen && (
        <ul
          aria-label="Dropdown menu"
          role="menu"
          className={classNames(styles.dropdown_menu)}
          ref={menuRef}
        >
          {menu.map((item, i) => {
            if (item.type === "decoration") {
              // Renders a decoration without focus/ref
              return item.decoration === "line" ? (
                <div className={styles.line} key={i} />
              ) : (
                <div className={styles.space} key={i} />
              );
            }
            return (
              <Item
                item={item}
                itemRef={itemRefs.current[actionableIndexes.indexOf(i)]}
                onClose={() => setClosing(true)}
                direction={direction}
                index={actionableIndexes.indexOf(i)}
                siblings={itemRefs.current}
                key={i}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
}

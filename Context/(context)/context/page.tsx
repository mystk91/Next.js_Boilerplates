import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import User from "./user";

export default function Page() {
  return (
    <div className={styles.page}>
      <div>
        <User />
      </div>
    </div>
  );
}

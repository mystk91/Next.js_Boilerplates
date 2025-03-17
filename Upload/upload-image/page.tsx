"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import UploadForm from "@/app/ui/Upload Form/Upload Image/uploadForm";

export default function Page() {
  const [images, setImages] = useState([]);

  async function getImages() {
    const res = await fetch("/api/upload/displayImages");
    const data = await res.json();
    if (data.images) {
      setImages(data.images);
    }
  }

  useEffect(() => {
    getImages();
  }, []);

  return (
    <div className={styles.page}>
      <UploadForm onUpload={getImages} />
      <div className={styles.images_wrapper}>
        {images.map((image) => (
          <div key={image} className={styles.image_wrapper}>
            <Image
              key={image}
              src={image}
              width={400}
              height={400}
              alt={image}
              style={{ objectFit: "cover", width: "100%" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

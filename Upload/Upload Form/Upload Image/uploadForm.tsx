"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./uploadForm.module.css";
import Button from "@/app/ui//Buttons/Button Set 1/button";
import Dropzone from "react-dropzone";
import { useDropzone } from "react-dropzone";

/*
 *   label - the initial label on the upload form
 *   onUpload - an optional function that will run after a successfull upload
 */
interface UploadForm {
  label?: string;
  onUpload?: () => void;
  style?: React.CSSProperties;
}

export default function UploadForm({
  label = "Upload an image",
  onUpload,
  style,
}: UploadForm) {
  const fileInput = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [currentLabel, setCurrentLabel] = useState(label);

  //Shows a preview image
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const timeoutRef = useRef<NodeJS.Timeout>();
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  //Uploads the the file automatically to backend after user chooses
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      //setCurrentLabel(e.target.files[0].name);
      const objectUrl = URL.createObjectURL(e.target.files[0]);
      setPreviewUrl(objectUrl);
      setCurrentLabel("");
      clearTimeout(timeoutRef.current);
      //Doing a timeout to mock fetch time
      timeoutRef.current = setTimeout(uploadFile, 2000);
      //uploadFile();
    } else {
      setCurrentLabel(label);
    }
  }

  // Handles file selection via drag-and-drop, uploads automatically
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && fileInput.current) {
      const uploadedFile = acceptedFiles[0];
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(uploadedFile);
      fileInput.current.files = dataTransfer.files;
      const objectUrl = URL.createObjectURL(uploadedFile);
      setPreviewUrl(objectUrl);
      //Doing a timeout to mock fetch time
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(uploadFile, 2000);
      setCurrentLabel("");
      //uploadFile();
      //setCurrentLabel(uploadedFile.name);
    }
  }, []);

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  //Uploads the file to the backend
  async function uploadFile(e?: React.FormEvent) {
    e?.preventDefault();
    const formData = new FormData();
    if (!fileInput.current?.files?.length) {
      setCurrentLabel(label);
      return;
    }
    formData.append("file", fileInput?.current?.files?.[0]!);
    if (formData.get(`file`)) {
      const res = await fetch("/api/upload/uploadImage", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      setPreviewUrl(null);
      if (result.error) {
        setCurrentLabel("File could not be uploaded");
      } else {
        onUpload?.();
        setCurrentLabel("Uploaded!");
      }

      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCurrentLabel(label), 2000);
    }
  }

  return (
    <div className={styles.form_wrapper} {...getRootProps()}>
      <form
        className={styles.upload_form}
        style={{ ...style }}
        onSubmit={uploadFile}
        ref={formRef}
      >
        <label className={styles.input_wrapper}>
          <div className={styles.input_label} aria-live="assertive">
            {isDragActive ? `Drop here` : currentLabel}
          </div>
          <input
            type="file"
            onChange={handleFileChange}
            ref={fileInput}
            accept="image/*"
            aria-label="Drag and drop an image here or click to upload"
          />
          {previewUrl && (
            <div className={styles.preview_wrapper}>
              <Image
                src={previewUrl}
                alt="image preview"
                width={200}
                height={200}
              />
            </div>
          )}
        </label>
      </form>
    </div>
  );
}

/*
        <div className={styles.button_wrapper}>
          <Button variant="secondary" type="submit">
            Submit
          </Button>
        </div>
*/

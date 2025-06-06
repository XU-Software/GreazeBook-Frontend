"use client";

import React, { useRef } from "react";
import { Button } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import axios from "@/lib/axios";

const ImportExcel = () => {
  const inputRef = useRef();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`/account/import-data`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = res.data;
      // if (!res.ok) throw new Error(data.error || "Upload failed");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload file.");
    } finally {
      e.target.value = null; // Reset file input
    }
  };

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept=".xlsx,.xls"
        hidden
      />
      <Button
        variant="contained"
        color="primary"
        startIcon={<UploadFileIcon />}
        onClick={() => inputRef.current.click()}
      >
        Import Excel
      </Button>
    </>
  );
};

export default ImportExcel;

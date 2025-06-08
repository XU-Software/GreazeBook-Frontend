"use client";

import * as XLSX from "xlsx";
import { Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const ExportExcel = ({ exportData = [], fileName = "", sheetName = "" }) => {
  const handleExport = () => {
    if (exportData.length < 1) return;

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <Button
      variant="outlined"
      color="primary"
      startIcon={<FileDownloadIcon />}
      onClick={handleExport}
    >
      Export
    </Button>
  );
};

export default ExportExcel;

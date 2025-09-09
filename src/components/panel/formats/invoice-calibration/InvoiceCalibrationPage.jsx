"use client";
import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  Divider,
} from "@mui/material";
import ReactToPrint from "react-to-print";
import Draggable from "react-draggable";
import SideBarSection from "./SideBarSection";
import CanvasSection from "./CanvasSection";
import PrintButton from "./PrintButton";

export default function InvoiceCalibrationPage() {
  const printRef = useRef();

  const predefinedFields = [
    { id: "invoiceDate", label: "Invoice Date" },
    { id: "accountName", label: "Account Name" },
    { id: "address", label: "Address" },
    { id: "term", label: "Term" },
    { id: "totalSales", label: "Total Sales (VAT Inclusive)" },
    { id: "lessVat", label: "Less VAT" },
    { id: "amountNetOfVat", label: "Amount Net of VAT" },
    { id: "totalAmountDue", label: "Total Amount Due" },
  ];

  // Default to A4 size (595 x 842 points = 210mm x 297mm approx)
  const [paperSize, setPaperSize] = useState({ width: 210, height: 297 });

  const [fields, setFields] = useState(
    predefinedFields.map((f, i) => ({
      ...f,
      x: 50 + i * 30,
      y: 50 + i * 40,
      fontSize: 12,
    }))
  );

  // One table for products
  const [table, setTable] = useState({
    id: "productsTable",
    x: 50,
    y: 500,
    // width: 400,
    // height: 200,
    fontSize: 12,
    rowHeight: 24,
    columns: [
      { field: "quantity", label: "Qty", width: 50 },
      { field: "productName", label: "Product", width: 200 },
      { field: "price", label: "Unit Price", width: 70 },
      { field: "amount", label: "Amount", width: 80 },
    ],
  });

  const handleStop = (e, data, id) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, x: data.x, y: data.y } : f))
    );
  };

  const handleFontSizeChange = (id, newSize) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, fontSize: newSize } : f))
    );
  };

  const handleTableChange = (key, value) => {
    setTable((prev) => ({ ...prev, [key]: value }));
  };

  const handleColumnChange = (index, key, value) => {
    setTable((prev) => {
      const updatedCols = [...prev.columns];
      updatedCols[index][key] = value;
      return { ...prev, columns: updatedCols };
    });
  };

  const handleSave = async () => {
    const config = {
      pageWidthMM: parseFloat(paperSize.width) || 0,
      pageHeightMM: parseFloat(paperSize.height) || 0,
      fields: fields.map((f) => ({
        name: f.id,
        x: f.x,
        y: f.y,
        fontSize: parseInt(f.fontSize) || 1,
      })),
      table: {
        ...table,
        rowHeight: parseFloat(table.rowHeight) || 24,
        fontSize: parseFloat(table.fontSize) || 1,
        columns: table.columns.map((column) => ({
          ...column,
          width: parseFloat(column.width) || 100,
        })),
      },
    };

    await fetch("/api/invoice-template", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh", // full screen height
        display: "flex",
        flexDirection: "column", // stack vertically
        justifyContent: "center", // center vertically
        alignItems: "center", // center horizontally
        p: 3,
      }}
    >
      <Box sx={{ width: "100%" }}>
        <Typography variant="h5" gutterBottom>
          Invoice Calibration
        </Typography>
        <Typography variant="body2" gutterBottom>
          Set your paper size, then drag fields onto the sheet to match your
          pre-formatted invoice paper.
        </Typography>

        <Grid container spacing={2}>
          {/*Sidebar Section*/}
          <SideBarSection
            paperSize={paperSize}
            setPaperSize={setPaperSize}
            fields={fields}
            handleFontSizeChange={handleFontSizeChange}
            table={table}
            handleTableChange={handleTableChange}
            handleColumnChange={handleColumnChange}
          />

          <Divider />

          {/* Canvas Section*/}
          <CanvasSection
            paperSize={paperSize}
            fields={fields}
            handleStop={handleStop}
            table={table}
            setTable={setTable}
            handleTableChange={handleTableChange}
          />
        </Grid>

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleSave}
        >
          Save Template
        </Button>

        <PrintButton fields={fields} table={table} paperSize={paperSize} />
      </Box>
    </Box>
  );
}

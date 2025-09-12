"use client";
import React, { useState, useEffect } from "react";
import {
  useSaveInvoiceTemplateMutation,
  useGetInvoiceTemplateQuery,
} from "@/state/services/invoicesApi";
import { useAppDispatch } from "@/app/redux";
import { setShowSnackbar } from "@/state/snackbarSlice";
import { Box, Button, Typography, Grid, Divider } from "@mui/material";
import SideBarSection from "./SideBarSection";
import CanvasSection from "./CanvasSection";
import PrintButton from "./PrintButton";
import LoadingSpinner from "@/components/Utils/LoadingSpinner";
import ErrorMessage from "@/components/Utils/ErrorMessage";

export default function InvoiceCalibrationPage() {
  const dispatch = useAppDispatch();

  // Conversion Helpers
  const mmToPx = (mm) => (parseFloat(mm) || 0) * 3.78; // Initial dimensions and data and even inputs should be in mm then convert to px in canvas section for preview
  const pxToMm = (px) => (parseFloat(px) || 0) / 3.78; // Draggable component x and y are in px so convert these to mm
  const mmToPt = (mm) => (parseFloat(mm) || 0) * 2.83465; // for print for fontSizes for device independent fontSize using points: `${mmToPt(fontSizeInMm)}pt`

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

  // Default to A4 size (595 x 842 points = 210mm x 297mm approx)  Store everything in mm
  const [paperSize, setPaperSize] = useState({ width: 210, height: 297 });

  const [fields, setFields] = useState(
    predefinedFields.map((f, i) => ({
      ...f,
      x: 20 + i * 10, // mm
      y: 10 + i * 10, // mm
      fontSize: 4, // mm
    }))
  );

  const [table, setTable] = useState({
    id: "productsTable",
    x: 20, // mm
    y: 100, // mm
    fontSize: 4, // mm
    rowHeight: 8, // mm
    columns: [
      { field: "quantity", label: "Qty", width: 15 },
      { field: "productName", label: "Product", width: 70 },
      { field: "price", label: "Unit Price", width: 25 },
      { field: "amount", label: "Amount", width: 30 },
    ],
  });

  const {
    data: invoiceTemplateData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetInvoiceTemplateQuery({
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  // Hydrate state once data is successfully fetched
  useEffect(() => {
    // Check first if the response from backend have status to true and have the data
    // Backend will respond with success true and data if company already have an invoice template, if not response will be success false and no data
    if (invoiceTemplateData?.success && invoiceTemplateData?.data) {
      const tpl = invoiceTemplateData.data;

      // Paper size
      setPaperSize({
        width: tpl.pageWidthMM ?? 210,
        height: tpl.pageHeightMM ?? 297,
      });

      // Fields (map backend -> frontend shape)
      if (Array.isArray(tpl.fields)) {
        setFields(
          tpl.fields.map((f) => ({
            id: f.name,
            label:
              predefinedFields.find((p) => p.id === f.name)?.label ?? f.name,
            x: f.x,
            y: f.y,
            fontSize: f.fontSize,
          }))
        );
      }

      // Table
      if (tpl.table) {
        setTable({
          ...tpl.table,
          x: tpl.table.x,
          y: tpl.table.y,
          fontSize: tpl.table.fontSize,
          rowHeight: tpl.table.rowHeight,
          columns: tpl.table.columns ?? [],
        });
      }
    }
  }, [invoiceTemplateData]);

  // x and y value from draggable is already a number and in px
  const handleStop = (e, data, id) => {
    setFields((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, x: pxToMm(data.x), y: pxToMm(data.y) } : f
      )
    );
  };

  const handleFontSizeChange = (id, newSizeMM) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, fontSize: newSizeMM } : f))
    );
  };

  const handleTableChange = (key, value) => {
    setTable((prev) => ({ ...prev, [key]: value }));
  };

  const handleTableStop = (e, data) =>
    setTable((prev) => ({ ...prev, x: pxToMm(data.x), y: pxToMm(data.y) }));

  const handleColumnChange = (index, key, value) => {
    setTable((prev) => {
      const updatedCols = [...prev.columns];
      updatedCols[index][key] = value;
      return { ...prev, columns: updatedCols };
    });
  };

  const [saveInvoiceTemplate, { isLoading: isSavingTemplate }] =
    useSaveInvoiceTemplateMutation();

  const handleSave = async () => {
    try {
      const config = {
        pageWidthMM: parseFloat(paperSize.width) || 10, // already in mm
        pageHeightMM: parseFloat(paperSize.height) || 10, // already in mm
        fields: fields.map((f) => ({
          name: f.id,
          x: parseFloat(f.x) || 0,
          y: parseFloat(f.y) || 0,
          fontSize: parseFloat(f.fontSize) || 1,
        })),
        table: {
          ...table,
          x: parseFloat(table.x) || 0,
          y: parseFloat(table.y) || 0,
          rowHeight: parseFloat(table.rowHeight) || 1,
          fontSize: parseFloat(table.fontSize) || 1,
          columns: table.columns.map((column) => ({
            ...column,
            width: parseFloat(column.width) || 1,
          })),
        },
      };

      const res = await saveInvoiceTemplate(config).unwrap();

      dispatch(
        setShowSnackbar({
          severity: "success",
          message: res.message || "Invoice template saved successfully",
        })
      );
    } catch (error) {
      dispatch(
        setShowSnackbar({
          severity: "error",
          message:
            error.data?.message ||
            error.message ||
            "Failed to save invoice template",
        })
      );
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !invoiceTemplateData) {
    return (
      <ErrorMessage
        message={
          error?.data?.message ||
          error?.error ||
          "Failed to load invoice template"
        }
        onRetry={refetch}
      />
    );
  }

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
        <Typography gutterBottom>
          Configure your Invoice Paper format first before printing.
        </Typography>
        <Typography gutterBottom>
          Set your paper size, then drag fields onto the sheet to match your
          pre-formatted invoice paper.
        </Typography>
        <Typography gutterBottom>Set each field's font size.</Typography>
        <Typography gutterBottom>
          Put your pre-formatted invoice paper in the printer then run{" "}
          <b>TEST PRINT</b>
        </Typography>
        <Typography gutterBottom>
          In the print preview, go to <b>MORE SETTINGS</b> and in <b>OPTIONS</b>{" "}
          uncheck all of the checkboxes
        </Typography>
        <Typography gutterBottom>
          If everything fits in your pre-formatted invoice paper, you can now{" "}
          <b>SAVE</b> the format and will automatically be used on every invoice
          printing.
        </Typography>
        <Box sx={{ my: 2, display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            loading={isSavingTemplate}
          >
            Save
          </Button>

          <PrintButton
            fields={fields}
            table={table}
            paperSize={paperSize}
            mmToPx={mmToPx}
            mmToPt={mmToPt}
          />
        </Box>
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
            handleTableChange={handleTableChange}
            handleTableStop={handleTableStop}
            mmToPx={mmToPx}
          />
        </Grid>
      </Box>
    </Box>
  );
}

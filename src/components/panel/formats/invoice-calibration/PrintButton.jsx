"use client";

import React, { useRef } from "react";
import { Button } from "@mui/material";
import { useReactToPrint } from "react-to-print";

import PrintCanvas from "./PrintCanvas";

export default function PrintButton({ fields, table, paperSize }) {
  const contentRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef,
  });

  return (
    <>
      <div style={{ display: "none" }}>
        <PrintCanvas
          ref={contentRef}
          fields={fields}
          table={table}
          paperSize={paperSize}
        />
      </div>

      <Button color="primary" variant="contained" onClick={handlePrint}>
        Print Invoice
      </Button>
    </>
  );
}

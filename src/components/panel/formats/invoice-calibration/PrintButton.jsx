"use client";

import React, { useRef } from "react";
import { Button } from "@mui/material";
import { useReactToPrint } from "react-to-print";

import PrintCanvas from "./PrintCanvas";

export default function PrintButton({
  fields,
  table,
  paperSize,
  mmToPx = () => {},
  mmToPt = () => {},
}) {
  const contentRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef,
    pageStyle: `@page { size: ${paperSize.width}mm ${paperSize.height}mm; margin: 0; }
    body { margin: 0; }`,
  });

  return (
    <>
      <div style={{ display: "none" }}>
        <PrintCanvas
          ref={contentRef}
          fields={fields}
          table={table}
          paperSize={paperSize}
          mmToPx={mmToPx}
          mmToPt={mmToPt}
        />
      </div>

      <Button color="primary" variant="contained" onClick={handlePrint}>
        Test Print
      </Button>
    </>
  );
}

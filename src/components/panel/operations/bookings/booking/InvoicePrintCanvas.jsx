"use client";

import React, { forwardRef } from "react";
import { Box, Typography } from "@mui/material";

const InvoicePrintCanvas = forwardRef(
  ({ paperSize, fields, table, mmToPx = () => {}, mmToPt = () => {} }, ref) => {
    return (
      <Box
        ref={ref}
        sx={{
          width: mmToPx(paperSize.width),
          height: mmToPx(paperSize.height),
          position: "relative",
          backgroundColor: "white",
        }}
      >
        {/* Render fields */}
        {fields.map((f) => (
          <Typography
            key={f.name}
            sx={{
              position: "absolute",
              left: mmToPx(f.x),
              top: mmToPx(f.y),
              fontSize: `${mmToPt(f.fontSize)}pt`,
            }}
          >
            {f.label}
          </Typography>
        ))}

        {/* Render table */}
        <Box
          sx={{
            position: "absolute",
            left: mmToPx(table.x),
            top: mmToPx(table.y),
            display: "flex",
            flexDirection: "column",
          }}
        >
          {table.rows.map((row, rowIdx) => (
            <Box
              key={rowIdx}
              sx={{
                display: "flex",
                height: mmToPx(table.rowHeight),
              }}
            >
              {table.columns.map((col, colIdx) => (
                <Box
                  key={colIdx}
                  sx={{
                    width: mmToPx(col.width),
                    textAlign: "center",
                    fontSize: `${mmToPt(table.fontSize)}pt`,
                  }}
                >
                  {row[col.field] ?? ""}
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    );
  }
);

export default InvoicePrintCanvas;

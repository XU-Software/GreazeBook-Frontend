"use client";

import React from "react";
import { Box, Typography } from "@mui/material";

const PrintCanvas = ({ fields, table, paperSize, ref }) => {
  // Convert mm to px (96 DPI)
  const mmToPx = (mm) => (parseFloat(mm) || 0) * 3.78;

  // Convert font size in points to px
  const fontPtToPx = (pt) => (parseFloat(pt) || 0) * 1.33;

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
      {/* Fields */}
      {fields.map((f) => (
        <Typography
          key={f.id}
          sx={{
            position: "absolute",
            left: f.x, // already in px from canvas state
            top: f.y,
            fontSize: fontPtToPx(f.fontSize),
          }}
        >
          {f.label}
        </Typography>
      ))}

      {/* Products Table */}
      <Box
        sx={{
          position: "absolute",
          left: table.x,
          top: table.y,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {[...Array(15)].map((_, rowIdx) => (
          <Box
            key={rowIdx}
            sx={{
              display: "flex",
              height: mmToPx(table.rowHeight),
            }}
          >
            {table.columns.map((col, idx) => (
              <Box
                key={idx}
                sx={{
                  width: mmToPx(col.width),
                  textAlign: "center",
                  fontSize: fontPtToPx(table.fontSize),
                }}
              >
                Sample
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PrintCanvas;

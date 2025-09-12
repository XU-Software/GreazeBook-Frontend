"use client";

import React, { forwardRef } from "react";
import { Box, Typography } from "@mui/material";

const PrintCanvas = forwardRef(
  ({ fields, table, paperSize, mmToPx = () => {}, mmToPt = () => {} }, ref) => {
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
              left: mmToPx(f.x), // already in px from canvas state
              top: mmToPx(f.y),
              fontSize: `${mmToPt(f.fontSize)}pt`, // use points when printing for fontSize from mm to pt
            }}
          >
            {f.label}
          </Typography>
        ))}

        {/* Products Table */}
        <Box
          sx={{
            position: "absolute",
            left: mmToPx(table.x),
            top: mmToPx(table.y),
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
                    fontSize: `${mmToPt(table.fontSize)}pt`, // use points when printing for fontSize from mm to pt
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
  }
);

export default PrintCanvas;

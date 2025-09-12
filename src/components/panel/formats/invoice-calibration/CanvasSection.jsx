"use client";

import React, { useRef } from "react";
import Draggable from "react-draggable";
import { Typography, Grid, Box } from "@mui/material";

const CanvasSection = ({
  paperSize,
  fields,
  handleStop = () => {},
  table,
  handleTableStop = () => {},
  mmToPx = () => {},
}) => {
  const tableRef = useRef(null);

  // Convert mm to pixels for on-screen preview (assume 3.78px/mm at 96 DPI)
  // const mmToPx = (mm) => (parseFloat(mm) || 0) * 3.78;
  // const fontPtToPx = (pt) => (parseFloat(pt) || 0) * 1.33; // 1pt ≈ 1.33px at 96dpi
  return (
    <Grid item size={{ xs: 12, md: 9 }} sx={{ overflow: "auto" }}>
      <Box
        sx={{
          mt: 2,
          border: "1px solid #ccc",
          width: mmToPx(paperSize.width),
          height: mmToPx(paperSize.height),
          position: "relative",
          backgroundColor: "white",
        }}
      >
        {fields.map((f) => {
          const nodeRef = useRef(null);
          return (
            <Draggable
              key={f.id}
              nodeRef={nodeRef}
              position={{ x: mmToPx(f.x), y: mmToPx(f.y) }}
              onStop={(e, data) => handleStop(e, data, f.id)}
            >
              <Box
                ref={nodeRef}
                sx={{
                  position: "absolute",
                  padding: "4px 6px",
                  border: "1px dashed #1976d2",
                  backgroundColor: "rgba(25,118,210,0.1)",
                  fontSize: mmToPx(f.fontSize),
                  cursor: "move",
                  whiteSpace: "nowrap",
                }}
              >
                {f.label}
              </Box>
            </Draggable>
          );
        })}

        {/* Draggable Products Table */}
        <Draggable
          nodeRef={tableRef}
          position={{ x: mmToPx(table.x), y: mmToPx(table.y) }}
          onStop={(e, data) => handleTableStop(e, data)}
        >
          <Box
            ref={tableRef}
            sx={{
              position: "absolute",
              border: "2px dashed #2e7d32",
              backgroundColor: "rgba(46,125,50,0.05)",
              //   width: parseFloat(table.width) || "auto",
              //   height: parseFloat(table.height) || "auto",
              //   fontSize: fontPtToPx(table.fontSize),
              cursor: "move",
              //   display: "flex",
              //   flexDirection: "column",
            }}
          >
            {/* <Typography variant="caption" sx={{ p: 1, display: "block" }}>
              Products Table (preview)
            </Typography> */}

            {/* Header rows */}
            <Box
              sx={{
                display: "flex",
                borderBottom: "1px solid #ccc",
                // flexShrink: 0,
              }}
            >
              {table.columns.map((col, idx) => (
                <Box
                  key={idx}
                  sx={{
                    width: mmToPx(col.width),
                    borderRight:
                      idx !== table.columns.length - 1
                        ? "1px solid #ccc"
                        : "none",
                    p: 0.5,
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: mmToPx(table.fontSize),
                  }}
                >
                  {col.label}
                </Box>
              ))}
            </Box>
            {/* Rows */}
            {[...Array(15)].map((_, rowIdx) => (
              <Box
                key={rowIdx}
                sx={{
                  display: "flex",
                  borderTop: "1px solid #ccc",
                  height: mmToPx(table.rowHeight),
                }}
              >
                {table.columns.map((col, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      width: mmToPx(col.width),
                      borderRight:
                        idx !== table.columns.length - 1
                          ? "1px solid #eee"
                          : "none",
                      p: 0.5,
                      textAlign: "center",
                      fontSize: mmToPx(table.fontSize),
                    }}
                  >
                    Sample
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Draggable>
      </Box>
    </Grid>
  );
};

export default CanvasSection;

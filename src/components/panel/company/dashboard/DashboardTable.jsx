"use client";

import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableFooter,
} from "@mui/material";

const DashboardTable = ({
  title = "",
  columns = [],
  data = [],
  summary = {},
  formatters = {},
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <TableContainer component={Paper} elevation={2}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              {columns.map(({ headerName }) => (
                <TableCell key={headerName} sx={{ fontWeight: "bold" }}>
                  {headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No data filtered. Please select a date range to view data.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, idx) => (
                <TableRow key={idx}>
                  {columns.map(({ field }) => {
                    const rawValue = row[field] ?? "";
                    const column = columns.find((col) => col.field === field);
                    const rendered = column.render
                      ? column.render(rawValue, row)
                      : formatters[field]
                      ? formatters[field](rawValue)
                      : rawValue;

                    return <TableCell key={field}>{rendered}</TableCell>;
                  })}
                </TableRow>
              ))
            )}
          </TableBody>

          {/* FOOTER: Summary Totals */}
          {data.length > 0 && (
            <TableFooter>
              <TableRow>
                {columns.map(({ field }, index) => {
                  if (index === 0) {
                    return (
                      <TableCell
                        key={`footer-${field}`}
                        align="right"
                        sx={{
                          fontSize: "1rem",
                          color: "text.primary",
                        }}
                      >
                        TOTAL
                      </TableCell>
                    );
                  }
                  const rawSummary = summary[field] ?? "";
                  const formattedSummary =
                    formatters[field] && typeof formatters[field] === "function"
                      ? formatters[field](rawSummary)
                      : rawSummary;

                  return (
                    <TableCell
                      key={`footer-${field}`}
                      sx={{
                        fontSize: "1rem",
                        color: "text.primary",
                      }}
                    >
                      {formattedSummary}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DashboardTable;

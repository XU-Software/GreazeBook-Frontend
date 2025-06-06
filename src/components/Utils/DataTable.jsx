"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
  Box,
} from "@mui/material";

export default function DataTable({
  rows = [],
  columns = [],
  onRowClick = () => {},
  getRowId = (row) => row.id,
  enableSelection = true,
  selected = [],
  onSelectChange = () => {},
}) {
  const isSelected = (id) => selected.includes(id);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = rows.map(getRowId);
      onSelectChange(allIds);
    } else {
      onSelectChange([]);
    }
  };

  const handleSelect = (event, id) => {
    event.stopPropagation();
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter((item) => item !== id);
    }

    onSelectChange(newSelected);
  };

  const handleRowClick = (row) => {
    onRowClick(getRowId(row), row);
  };

  return (
    <Box>
      {rows.length < 1 ? (
        <p className="m-auto w-fit font-semibold text-2xl py-4">
          No records found
        </p>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
          <Table>
            <TableHead>
              <TableRow>
                {enableSelection && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.length === rows.length}
                      indeterminate={
                        selected.length > 0 && selected.length < rows.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                )}
                {columns.map((col) => (
                  <TableCell
                    key={col.field}
                    sx={{
                      fontWeight: "bold",
                      fontSize: "1rem",
                    }}
                  >
                    {col.headerName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row) => {
                const id = getRowId(row);
                return (
                  <TableRow
                    key={id}
                    hover
                    onClick={() => handleRowClick(row)}
                    sx={{ cursor: "pointer" }}
                  >
                    {enableSelection && (
                      <TableCell
                        padding="checkbox"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={isSelected(id)}
                          onChange={(e) => handleSelect(e, id)}
                        />
                      </TableCell>
                    )}
                    {columns.map((col) => (
                      <TableCell key={col.field}>
                        {typeof col.render === "function"
                          ? col.render(row[col.field], row)
                          : row[col.field]}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

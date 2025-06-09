"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Box,
} from "@mui/material";

const MemoizedTableRow = React.memo(
  ({ row, id, columns, isSelected, onRowClick, onSelect, enableSelection }) => {
    return (
      <TableRow
        key={id}
        hover
        onClick={() => onRowClick(id)}
        sx={{ cursor: "pointer" }}
      >
        {enableSelection && (
          <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
            <Checkbox checked={isSelected} onChange={(e) => onSelect(e, id)} />
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
  },
  (prevProps, nextProps) => {
    return prevProps.isSelected === nextProps.isSelected;
  }
);

export default function DataTable({
  rows = [],
  columns = [],
  onRowClick = () => {},
  getRowId = (row) => row.id,
  enableSelection = true,
  selected = [],
  setSelected = () => {},
}) {
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(new Set(rows.map(getRowId)));
    } else {
      setSelected(new Set());
    }
  };

  const handleSelect = (e, id) => {
    setSelected((prev) => {
      const newSet = new Set(prev);
      if (e.target.checked) newSet.add(id);
      else newSet.delete(id);
      return newSet;
    });
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
                      checked={selected.size === rows.length}
                      indeterminate={
                        selected.size > 0 && selected.size < rows.length
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
              {rows.map((row, index) => {
                const id = getRowId(row);

                return (
                  <MemoizedTableRow
                    key={id}
                    id={id}
                    row={row}
                    columns={columns}
                    isSelected={selected.has(id)}
                    onRowClick={onRowClick}
                    onSelect={handleSelect}
                    enableSelection={enableSelection}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

"use client";

import { IconButton, Tooltip, Box } from "@mui/material";
import { Sort, ArrowUpward, ArrowDownward } from "@mui/icons-material";

export default function SortToggle({
  sortOrder = "desc",
  setSortOrder = () => {},
  title = "Sort by date",
}) {
  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <Tooltip
      title={`${title} ${sortOrder === "asc" ? "descending" : "ascending"}`}
    >
      <IconButton onClick={toggleSort} size="medium">
        <Box display="flex" alignItems="center">
          <Sort sx={{ fontSize: 26 }} />
          {sortOrder === "asc" ? (
            <ArrowUpward fontSize="small" />
          ) : (
            <ArrowDownward fontSize="small" />
          )}
        </Box>
      </IconButton>
    </Tooltip>
  );
}

"use client";

import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
} from "@mui/material";
import { useAppSelector } from "@/app/redux";
import clsx from "clsx";

const PaginationBar = ({
  limit,
  handleLimitChange,
  totalPages,
  page,
  handlePageChange,
}) => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  return (
    <div
      className={clsx(
        "bg-white border border-gray-200 fixed bottom-4 w-[calc(100%-2rem)] transition-all duration-300 ease-in-out z-20 h-16",
        isSidebarCollapsed
          ? "md:w-[calc(100%-8rem)]"
          : "md:w-[calc(100%-21rem)]"
      )}
    >
      <div className="w-full overflow-x-auto">
        <div className="flex items-center justify-center gap-4 px-2 py-3 min-w-max">
          <FormControl size="small" sx={{ minWidth: "5rem", flexShrink: 0 }}>
            <InputLabel id="limit-label">Item limit</InputLabel>
            <Select
              labelId="limit-label"
              value={limit}
              label="Item limit"
              onChange={handleLimitChange}
            >
              {[5, 10, 25, 50].map((limit) => (
                <MenuItem key={limit} value={limit}>
                  {limit}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            siblingCount={2}
            color="primary"
            sx={{
              "& .MuiPagination-ul": {
                flexWrap: "nowrap",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PaginationBar;

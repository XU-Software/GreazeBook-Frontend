"use client";

import React, { useRef, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Typography,
  Chip,
  Box,
  Tooltip,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import DataTable from "@/components/Utils/DataTable";
import SearchBar from "@/components/Utils/SearchBar";

const AccountBreakdownSection = ({
  title,
  subtitleChips = [],
  rows = [],
  columns = [],
  setSearch = () => {},
  setPage = () => {},
  handleFetchNext = () => {},
  onRowClick = () => {},
  enableSearch = false,
  hasMore = true,
}) => {
  const containerRef = useRef(null);
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return; // Stop observing if no more data

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          handleFetchNext();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [rows, hasMore]); // Re-run if rows update or hasMore changes

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          backgroundColor: "background.paper", // So it doesn’t look transparent when sticky
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          sx={{ width: "100%" }}
        >
          <Typography variant="subtitle1">{title}</Typography>
          <Stack direction="row" spacing={2}>
            {subtitleChips.map((chip, i) => (
              <Chip
                key={i}
                label={`${chip.label}: ${chip.count}`}
                color={chip.color}
                size="small"
              />
            ))}
          </Stack>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        {enableSearch && (
          <Box mb={2}>
            <SearchBar setSearch={setSearch} setPage={setPage} />
          </Box>
        )}

        <Box ref={containerRef} className="overflow-y-auto max-h-[60vh]">
          <DataTable
            rows={rows}
            columns={columns}
            onRowClick={onRowClick}
            enableSelection={false}
          />

          {rows.length === 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              className="text-center py-4"
            >
              No records found.
            </Typography>
          )}

          {/* Sentinel div for IntersectionObserver */}
          {hasMore && <div ref={sentinelRef} style={{ height: "1px" }} />}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default AccountBreakdownSection;

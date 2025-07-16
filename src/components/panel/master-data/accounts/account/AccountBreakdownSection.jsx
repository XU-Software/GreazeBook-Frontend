"use client";

import React, { useMemo } from "react";
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
}) => {
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

        <Box
          className="overflow-y-auto max-h-[60vh]"
          onScroll={(e) => {
            const t = e.currentTarget;
            if (t.scrollTop + t.clientHeight >= t.scrollHeight - 100) {
              handleFetchNext();
            }
          }}
        >
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
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default AccountBreakdownSection;

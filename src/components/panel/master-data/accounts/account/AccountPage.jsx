"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Typography,
  Stack,
  Button,
  Grid,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import LoadingSpinner from "@/components/Utils/LoadingSpinner";
import ErrorMessage from "@/components/Utils/ErrorMessage";
import DynamicBreadcrumbs from "@/components/Utils/DynamicBreadcrumbs";
import { formatDateWithTime } from "@/utils/dateFormatter";
import { formatToLocalCurrency } from "@/utils/currencyFormatter";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import AccountMetrics from "./AccountMetrics";
import AccountInformation from "./AccountInformation";

const AccountPage = () => {
  const params = useParams();
  const { accountId } = params;

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleFilterDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return;
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const handleClearInput = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <>
      <DynamicBreadcrumbs />
      <Box sx={{ p: 2, mx: "auto" }}>
        {/* Account information*/}
        <AccountInformation
          accountId={accountId}
          onFilter={handleFilterDateRange}
          onClear={handleClearInput}
        />

        {/* Account metrics*/}
        <Typography variant="h6" gutterBottom>
          Summary
        </Typography>

        <AccountMetrics
          accountId={accountId}
          startDate={startDate}
          endDate={endDate}
        />

        {/* Account lists (AR, sales, payments, refunds, creditMemos)*/}
        <Typography variant="h6" gutterBottom>
          Breakdown
        </Typography>

        {/* {[
          {
            title: "Accounts Receivable",
            subtitleChips: [
              { label: "Unpaid", count: arStatus.unpaid, color: "error" },
              { label: "Partial", count: arStatus.partial, color: "warning" },
              { label: "Paid", count: arStatus.paid, color: "success" },
              { label: "Overdue", count: arStatus.overdue, color: "secondary" },
            ],
            data: accountsReceivable,
            columns: ["date", "invoiceNumber", "amount"],
          },
          {
            title: "Payments History",
            data: payments,
            columns: ["date", "amount", "method"],
          },
          {
            title: "Sales Orders",
            data: orders,
            columns: ["date", "orderNumber", "amount"],
          },
          { title: "Refunds History", data: timeline, columns: ["text"] },
          {
            title: "Credit Memos",
            data: timeline,
            columns: ["text"],
          },
        ].map((section, idx) => (
          <Accordion key={idx} defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
              >
                <Typography variant="subtitle1" sx={{ mr: 2 }}>
                  {section.title}
                </Typography>
                {section.subtitleChips &&
                  section.subtitleChips.map((chip, index) => (
                    <Chip
                      key={index}
                      label={`${chip.label}: ${chip.count}`}
                      color={chip.color}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  ))}
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              {section.data?.length === 0 ? (
                <Typography color="text.secondary">
                  No records available.
                </Typography>
              ) : (
                <Box className="overflow-x-auto">
                  <TableContainer>
                    <Table size="medium">
                      <TableHead>
                        <TableRow>
                          {section.columns.map((col, i) => (
                            <TableCell key={i}>
                              {col.charAt(0).toUpperCase() + col.slice(1)}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {section.data.map((row, i) => (
                          <TableRow key={i}>
                            {section.columns.map((col, j) => (
                              <TableCell key={j}>
                                {col === "amount"
                                  ? formatToLocalCurrency(row[col])
                                  : col === "date"
                                  ? formatDateWithTime(row[col])
                                  : row[col]}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        ))} */}
      </Box>
    </>
  );
};

export default AccountPage;

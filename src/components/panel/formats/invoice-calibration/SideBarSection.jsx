"use client";

import React from "react";
import { Grid, Box, Typography, TextField } from "@mui/material";

const SideBarSection = ({
  paperSize,
  setPaperSize = () => {},
  fields = [],
  handleFontSizeChange = () => {},
  table,
  handleTableChange = () => {},
  handleColumnChange = () => {},
}) => {
  return (
    <Grid item size={{ xs: 12, md: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {/* Paper Size Section */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Paper Size
          </Typography>
          <Grid container spacing={2}>
            <Grid item size={{ xs: 12, sm: 6, md: 12 }}>
              <TextField
                label="Paper Width (mm)"
                type="number"
                value={paperSize.width}
                onChange={(e) =>
                  setPaperSize({ ...paperSize, width: e.target.value })
                }
                fullWidth
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6, md: 12 }}>
              <TextField
                label="Paper Height (mm)"
                type="number"
                value={paperSize.height}
                onChange={(e) =>
                  setPaperSize({ ...paperSize, height: e.target.value })
                }
                fullWidth
              />
            </Grid>
          </Grid>
        </Box>

        {/* Field Settings Section */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Field Settings
          </Typography>
          <Grid container spacing={2}>
            {fields.map((f) => (
              <Grid size={{ xs: 12, sm: 6, md: 12 }} key={f.id}>
                <Typography gutterBottom>{f.label}</Typography>
                <TextField
                  label="Font Size"
                  type="number"
                  value={f.fontSize}
                  onChange={(e) => handleFontSizeChange(f.id, e.target.value)}
                  size="small"
                  fullWidth
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Table settings */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Products Table
          </Typography>
          <TextField
            label="Row Height"
            type="number"
            value={table.rowHeight}
            onChange={(e) => handleTableChange("rowHeight", e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Font Size"
            type="number"
            value={table.fontSize}
            onChange={(e) => handleTableChange("fontSize", e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          {table.columns.map((col, idx) => (
            <Box key={idx} sx={{ mb: 1 }}>
              <Typography>{col.label}</Typography>
              <TextField
                label="Column Width"
                type="number"
                value={col.width}
                onChange={(e) =>
                  handleColumnChange(idx, "width", e.target.value)
                }
                fullWidth
                size="small"
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Grid>
  );
};

export default SideBarSection;

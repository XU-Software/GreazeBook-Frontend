"use client";

import React from "react";
import Link from "next/link";
import { IconButton, Tooltip } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

const HomeButton = () => {
  return (
    <Tooltip title="Go Home">
      <IconButton
        size="medium"
        color="primary"
        component={Link}
        href={process.env.NEXT_PUBLIC_BASE_URL || "/"}
        sx={{ width: "fit-content" }}
      >
        <HomeIcon sx={{ fontSize: 36 }} />
      </IconButton>
    </Tooltip>
  );
};

export default HomeButton;

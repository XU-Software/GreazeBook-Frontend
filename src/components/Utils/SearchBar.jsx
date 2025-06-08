"use client";

import React, { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ setSearch = () => {}, setPage = () => {} }) => {
  const [keyword, setKeyword] = useState("");

  const handleKeywordChange = (e) => {
    const value = e.target.value;
    setKeyword(value);

    // Automatically refetch all data when cleared
    if (value.trim() === "") {
      setSearch(""); // Refetch everything
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // prevent page reload
    setSearch(keyword.trim());
    setPage(1);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 md:w-full max-w-md"
    >
      <TextField
        size="small"
        fullWidth
        placeholder="Search..."
        value={keyword}
        onChange={handleKeywordChange}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton type="submit" edge="end" aria-label="search">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </form>
  );
};

export default SearchBar;

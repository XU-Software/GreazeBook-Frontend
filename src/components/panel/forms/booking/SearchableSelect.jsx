"use client";

import { Autocomplete, TextField } from "@mui/material";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "@/components/Utils/LoadingSpinner";
import ErrorMessage from "@/components/Utils/ErrorMessage";

export default function SearchableSelect({
  label = "Search",
  queryHook,
  getOptionKey,
  getOptionLabel,
  onSelect,
  value = null,
  disabled = false,
  isOptionEqualToValue = false,
}) {
  const [input, setInput] = useState("");
  const [page, setPage] = useState(1);
  const [options, setOptions] = useState([]);

  const debouncedSearch = useDebounce(input, 500);

  const queryArgs = useMemo(
    () => ({
      page,
      limit: 20,
      sortOrder: "desc",
      search: debouncedSearch,
    }),
    [page, debouncedSearch]
  );

  const {
    data: response,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
    refetch,
  } = queryHook(queryArgs, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  // Append or reset options based on input
  useEffect(() => {
    if (isSuccess && response) {
      if (page === 1) {
        setOptions(response?.data || []);
      } else {
        setOptions((prev) => [...prev, ...(response?.data || [])]);
      }
    }
  }, [response, isSuccess]);

  // Reset to page 1 when search input changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // Infinite scroll trigger
  const handleScroll = (event) => {
    const listboxNode = event.currentTarget;
    const scrollBottom = listboxNode.scrollTop + listboxNode.clientHeight;
    const scrollHeight = listboxNode.scrollHeight;

    if (
      scrollBottom >= scrollHeight - 100 &&
      !isFetching &&
      page < response?.totalPages
    ) {
      setPage((prev) => prev + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !response) {
    return (
      <ErrorMessage
        message={error?.data?.message || error?.error || "Failed to load data"}
        onRetry={refetch}
      />
    );
  }

  return (
    <Autocomplete
      fullWidth
      options={options}
      getOptionKey={getOptionKey}
      getOptionLabel={getOptionLabel}
      loading={isLoading || isFetching}
      onInputChange={(_, value) => setInput(value)}
      onChange={(_, value) => onSelect(value)}
      value={value}
      isOptionEqualToValue={isOptionEqualToValue}
      filterOptions={(x) => x} // prevent MUI from client-side filtering
      slotProps={{
        listbox: {
          onScroll: handleScroll,
        },
      }}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {/* {(isLoading || isFetching) && (
                    <CircularProgress color="inherit" size={20} />
                  )} */}
                {params.InputProps?.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}

"use client";

import { TablePagination } from "@mui/material";

const PaginationControls = ({
  total = 0,
  page = 1,
  limit = 10,
  handlePageChange = () => {},
  handleLimitChange = () => {},
}) => {
  return (
    <TablePagination
      component="div"
      count={total}
      page={page - 1} // MUI pagination is 0-based
      onPageChange={handlePageChange}
      rowsPerPage={limit}
      onRowsPerPageChange={handleLimitChange}
      rowsPerPageOptions={[10, 25, 50, 100]}
    />
  );
};

export default PaginationControls;

"use client";

import React, { useRef, useState } from "react";
import {
  Button,
  Modal,
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 600 },
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
  maxHeight: "90vh",
  overflow: "auto",
};

const ImportExcel = ({
  handleImportExcel = () => {},
  isImporting = false,
  rowGuide = {},
  columnsGuide = [],
}) => {
  const inputRef = useRef();

  // const [selectedFile, setSelectedFile] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    handleImportExcel(file);
    e.target.value = null; // reset
  };

  const handleOpenFilePicker = () => {
    setShowModal(false);
    setTimeout(() => inputRef.current?.click(), 200); // delay to allow modal to close smoothly
  };

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept=".xlsx,.xls"
        hidden
      />
      <Button
        variant="contained"
        color="primary"
        startIcon={<UploadFileIcon />}
        onClick={() => setShowModal(true)}
        disabled={isImporting}
      >
        Import Excel
      </Button>

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" mb={2}>
            Excel Format Instructions
          </Typography>

          <Typography variant="body2" gutterBottom>
            Your Excel file must include these headers:
          </Typography>

          <ul>
            {columnsGuide.map((header) => (
              <li key={header.field}>
                {header.headerName} : {header.type}
              </li>
            ))}
          </ul>

          <Typography variant="body2" mt={2}>
            Example Row: Format should be followed strictly from column names
            and data type
          </Typography>

          <TableContainer component={Paper} sx={{ mt: 1, mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {columnsGuide.map((header) => (
                    <TableCell key={header.field}>
                      {header.headerName}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  {columnsGuide.map((key) => (
                    <TableCell key={key.field}>{rowGuide[key.field]}</TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button
              variant="contained"
              onClick={handleOpenFilePicker}
              loading={isImporting}
            >
              Continue to Upload
            </Button>
            <Button onClick={() => setShowModal(false)}>Cancel</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ImportExcel;

"use client";

import React, { useState } from "react";
import { useAddBookingNoteMutation } from "@/state/services/bookingsApi";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  TextField,
  Tooltip,
  IconButton,
  Divider,
} from "@mui/material";
import { Send } from "@mui/icons-material";
import { useAppDispatch } from "@/app/redux";
import { setShowSnackbar } from "@/state/snackbarSlice";
import { formatDateWithTime } from "@/utils/dateFormatter";

const NoteDetails = ({ bookingData, bookingId = "" }) => {
  const dispatch = useAppDispatch();

  // Note state
  const [bookingNote, setBookingNote] = useState("");

  const [addBookingNote, { isLoading: isAddingNote }] =
    useAddBookingNoteMutation();

  const handleAddBookingNote = async (e, bookingId, note) => {
    e.preventDefault();
    try {
      if (!note || note.trim() === "") return;
      const res = await addBookingNote({ bookingId, note }).unwrap();
      dispatch(
        setShowSnackbar({
          severity: "success",
          message: res.message || "Note posted",
        })
      );
      setBookingNote("");
    } catch (error) {
      dispatch(
        setShowSnackbar({
          severity: "error",
          message:
            error.data?.message || error.message || "Failed to post note",
        })
      );
    }
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          📝 Notes / Internal Comments
        </Typography>
        {/* <Box sx={{wordBreak:"break-word", display: "flex", flexDirection: "column", gap: 4 }}> */}
        {bookingData?.data.bookingNotes.length === 0 ? (
          <Box p={2}>
            <Typography variant="body2" color="text.secondary">
              No notes yet.
            </Typography>
          </Box>
        ) : (
          <Box
            mt={2}
            p={2}
            component={Paper}
            variant="outlined"
            sx={{
              maxHeight: 400,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {bookingData?.data.bookingNotes.map((note, index) => (
              <Box key={index}>
                <Typography variant="body1" color="text.primary">
                  {note.note}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {note.createdBy?.name || note.createdBy?.email || "Unknown"}{" "}
                  &middot; {formatDateWithTime(note.createdAt)}
                </Typography>
                {index < bookingData?.data.bookingNotes.length - 1 && (
                  <Divider sx={{ my: 1 }} />
                )}
              </Box>
            ))}
          </Box>
        )}
        {/* </Box> */}
        <form onSubmit={(e) => handleAddBookingNote(e, bookingId, bookingNote)}>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Optional notes or internal comments for this booking..."
            name="bookingNote"
            value={bookingNote}
            onChange={(e) => setBookingNote(e.target.value)}
          />
          <Tooltip title="Send" arrow>
            <IconButton
              color="primary"
              type="submit"
              disabled={!bookingNote || bookingNote.trim() === ""}
              loading={isAddingNote}
              size="medium"
            >
              <Send fontSize="medium" />
            </IconButton>
          </Tooltip>
        </form>
      </CardContent>
    </Card>
  );
};

export default React.memo(NoteDetails);

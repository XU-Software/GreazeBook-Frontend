import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Grid,
  MenuItem,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useInviteCompanyUserMutation } from "@/state/api";
import FeedbackSnackbar from "@/components/Utils/FeedbackSnackbar";
import { useAppDispatch } from "@/app/redux";
import { setShowSnackbar } from "@/state/snackbarSlice";

const roles = ["admin", "user"];

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 600,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
  maxHeight: "90vh",
  overflowY: "auto",
};

export default function InviteModal() {
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);
  const [invite, setInvite] = useState({
    email: "",
    role: "user",
  });

  const [inviteCompanyUser, { isLoading: isInviting }] =
    useInviteCompanyUserMutation();

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setInvite({ email: "", role: "user" });
  };

  const handleChange = (field, value) => {
    setInvite((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!invite.email || !invite.role) return;
    try {
      const res = await inviteCompanyUser({
        email: invite.email,
        role: invite.role,
      }).unwrap();

      dispatch(
        setShowSnackbar({
          severity: "success",
          message: res.message || "Invite sent",
        })
      );
    } catch (error) {
      dispatch(
        setShowSnackbar({
          severity: "error",
          message:
            error.data?.message || error.message || "Failed to send invite",
        })
      );
    } finally {
      handleClose();
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<SendIcon />}
        onClick={handleOpen}
      >
        Send Invite
      </Button>

      <Modal open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <Box sx={modalStyle}>
            <Typography variant="h6" mb={2}>
              Invite People
            </Typography>

            <TextField
              fullWidth
              label="Email"
              type="email"
              required
              value={invite.email}
              onChange={(e) => handleChange("email", e.target.value)}
              margin="normal"
            />

            <TextField
              fullWidth
              select
              label="Role"
              required
              value={invite.role}
              onChange={(e) => handleChange("role", e.target.value)}
              margin="normal"
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
                </MenuItem>
              ))}
            </TextField>

            <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                loading={isInviting}
                disabled={!invite.email || !invite.role}
              >
                Send Invite
              </Button>
            </Box>
          </Box>
        </form>
      </Modal>
    </>
  );
}

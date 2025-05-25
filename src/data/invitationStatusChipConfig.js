import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import AccessTimeIcon from "@mui/icons-material/AccessTime"; // For expired

const statusChipConfig = {
  Pending: {
    icon: <HourglassEmptyIcon sx={{ fontSize: 16 }} />,
    style: {
      backgroundColor: "#FFF4CE",
      color: "#664D03",
    },
  },
  Accepted: {
    icon: <CheckCircleIcon sx={{ fontSize: 16 }} />,
    style: {
      backgroundColor: "#D1FADF",
      color: "#027A48",
    },
  },
  Cancelled: {
    icon: <CancelIcon sx={{ fontSize: 16 }} />,
    style: {
      backgroundColor: "#FEE4E2",
      color: "#B42318",
    },
  },
  Expired: {
    icon: <AccessTimeIcon sx={{ fontSize: 16 }} />,
    style: {
      backgroundColor: "#E0E0E0",
      color: "#6B7280",
    },
  },
};

export default statusChipConfig;

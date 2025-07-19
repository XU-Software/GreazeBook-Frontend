import PeopleIcon from "@mui/icons-material/People";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import EventNoteIcon from "@mui/icons-material/EventNote";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import BarChartIcon from "@mui/icons-material/BarChart";
import PaymentIcon from "@mui/icons-material/Payment";
import ReplayIcon from "@mui/icons-material/Replay";
import UndoIcon from "@mui/icons-material/Undo";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DashboardIcon from "@mui/icons-material/Dashboard"; // Optional for Home or Dashboard route

export const navigationPageList = [
  { kind: "header", title: "Company" },
  {
    title: "Dashboard",
    href: "/company/dashboard",
    icon: DashboardIcon,
    allowedRoles: ["admin", "user"],
  },
  {
    title: "Invitations",
    href: "/company/invitations",
    icon: GroupAddIcon,
    allowedRoles: ["admin"],
  },
  {
    title: "People",
    href: "/company/people",
    icon: PeopleIcon,
    allowedRoles: ["admin"],
  },
  {
    kind: "header",
    title: "Master Data",
  },
  {
    title: "Accounts",
    href: "/master-data/accounts",
    icon: AccountCircleIcon,
    allowedRoles: ["admin", "user"],
  },
  {
    title: "Products",
    href: "/master-data/products",
    icon: Inventory2Icon,
    allowedRoles: ["admin"],
  },
  {
    kind: "header",
    title: "Operations",
  },
  {
    title: "Accounts Receivables",
    href: "/operations/accounts-receivables",
    icon: AccountBalanceWalletIcon,
    allowedRoles: ["admin", "user"],
  },
  {
    title: "Bookings",
    href: "/operations/bookings",
    icon: EventNoteIcon,
    allowedRoles: ["admin", "user"],
  },
  {
    title: "Invoices",
    href: "/operations/invoices",
    icon: ReceiptLongIcon,
    allowedRoles: ["admin"],
  },
  {
    title: "Orders",
    href: "/operations/orders",
    icon: LocalShippingIcon,
    allowedRoles: ["admin", "user"],
  },
  {
    title: "Sales",
    href: "/operations/sales",
    icon: BarChartIcon,
    allowedRoles: ["admin"],
  },
  {
    kind: "header",
    title: "Transaction History",
  },
  {
    title: "Payment",
    href: "/transaction-history/payment",
    icon: PaymentIcon,
    allowedRoles: ["admin"],
  },
  {
    title: "Overpayment",
    href: "/transaction-history/overpayment",
    icon: ReplayIcon,
    allowedRoles: ["admin"],
  },
  {
    title: "Refund",
    href: "/transaction-history/refund",
    icon: UndoIcon,
    allowedRoles: ["admin"],
  },
  {
    title: "Credit Memo",
    href: "/transaction-history/credit-memo",
    icon: ReceiptIcon,
    allowedRoles: ["admin"],
  },
  {
    kind: "header",
    title: "Forms",
  },
  {
    title: "Booking Form",
    href: "/forms/booking",
    icon: AssignmentIcon,
    allowedRoles: ["admin", "user"],
  },
];

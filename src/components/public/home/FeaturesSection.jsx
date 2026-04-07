import { motion } from "framer-motion";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DescriptionIcon from "@mui/icons-material/Description";
import InventoryIcon from "@mui/icons-material/Inventory";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const features = [
  {
    icon: AssignmentIcon,
    title: "Order Booking & Approval",
    description:
      "Let sales reps book orders on the go. Managers approve with one click — no spreadsheets, no delays.",
  },
  {
    icon: DescriptionIcon,
    title: "Invoice & Accounts Receivable",
    description:
      "Auto-generate invoices tied to approved orders. Track payments, balances, and aging in real time.",
  },
  {
    icon: InventoryIcon,
    title: "Stock & Product Management",
    description:
      "Monitor inventory levels across warehouses. Get alerts before stock runs out — never miss a sale.",
  },
  {
    icon: TrendingUpIcon,
    title: "Sales & Transaction Tracking",
    description:
      "See every sale, every rep, every route. Gain visibility into your distribution performance instantly.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 lg:py-28 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block text-xs font-medium text-primary bg-secondary px-3 py-1 rounded-full mb-4 border border-primary/10">
            What You Get
          </span>
          <h2 className="font-bold text-3xl md:text-4xl text-foreground tracking-tight">
            Everything you need to run distribution
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="group bg-white border border-border/70 rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-t-2 hover:border-t-primary"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-4">
                  <Icon className="text-primary" sx={{ fontSize: 20 }} />
                </div>
                <h3 className="font-semibold text-base text-black mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "50K+", label: "Orders Processed" },
  { value: "200+", label: "Business Clients" },
  { value: "99.9%", label: "Uptime" },
  { value: "3×", label: "Faster Fulfillment" },
];

export default function StatsStrip() {
  return (
    <section className="bg-[#0D47A1] py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="text-center"
          >
            <div className="font-bold text-3xl md:text-4xl text-white">
              {stat.value}
            </div>
            <div className="text-sm text-blue-200 mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

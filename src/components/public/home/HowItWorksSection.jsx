"use client";

import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Register Your Company",
    description:
      "Set up your account, add your team, and configure your product catalog in minutes.",
  },
  {
    number: "02",
    title: "Book & Approve Orders",
    description:
      "Sales reps create orders from the field. Managers review and approve them instantly.",
  },
  {
    number: "03",
    title: "Invoice & Collect",
    description:
      "Invoices are auto-generated on approval. Track payments and outstanding balances easily.",
  },
  {
    number: "04",
    title: "Track Everything",
    description:
      "Monitor deliveries, sales performance, and inventory from a single dashboard.",
  },
];

const chartBars = [
  { height: 45 },
  { height: 62 },
  { height: 55 },
  { height: 78 },
  { height: 72 },
  { height: 88 },
  { height: 82 },
  { height: 95 },
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 lg:py-28 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-xs font-bold tracking-widest uppercase text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full mb-4 border border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
          >
            How It Works
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
            From sign‑up to{" "}
            <span className="text-blue-600">streamlined ops</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Steps List */}
          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="group flex gap-6"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  {step.number}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Data Visualization Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-xl shadow-blue-500/5"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between mb-10">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">
                  Fulfillment Rate
                </h4>
                <p className="text-sm text-slate-500">
                  Performance Metrics • Last 8 weeks
                </p>
              </div>
              <div className="text-right">
                <span className="font-bold text-3xl text-blue-600 tracking-tight">
                  95%
                </span>
                <p className="text-xs text-emerald-500 font-bold flex items-center justify-end gap-1">
                  <span className="inline-block rotate-[-45deg] transition-transform">
                    →
                  </span>
                  +12.4%
                </p>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="flex items-end justify-between gap-3 h-48">
              {chartBars.map((bar, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-3"
                >
                  <div className="relative w-full h-full flex items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      whileInView={{ height: `${bar.height}%` }}
                      viewport={{ once: true }}
                      transition={{
                        delay: 0.5 + i * 0.08,
                        duration: 0.8,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="w-full bg-blue-100 dark:bg-blue-900/20 rounded-t-lg relative group transition-colors hover:bg-blue-200 dark:hover:bg-blue-900/40"
                    >
                      <div className="absolute bottom-0 left-0 right-0 bg-blue-600 rounded-t-lg h-full scale-y-[1] origin-bottom" />
                    </motion.div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    W{i + 1}
                  </span>
                </div>
              ))}
            </div>

            {/* Decorative Background Glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 blur-[80px] -z-10 rounded-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

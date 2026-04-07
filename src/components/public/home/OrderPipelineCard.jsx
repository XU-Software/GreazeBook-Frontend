"use client";

import { useState, useEffect, useRef } from "react";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

const stages = [
  { label: "Booked", icon: AssignmentIcon },
  { label: "Approved", icon: CheckCircleIcon },
  { label: "Invoiced", icon: DescriptionIcon },
  { label: "Delivered", icon: LocalShippingIcon },
];

const orders = [
  {
    initials: "MC",
    color: "bg-blue-100 text-blue-700",
    client: "Metro Craft Co.",
    product: "SAE 40 Motor Oil",
    id: "ORD-2851",
    status: "Booked",
    statusStyle: "bg-blue-50 text-blue-700 border border-blue-100",
    amount: "₱42,500",
  },
  {
    initials: "VA",
    color: "bg-green-100 text-green-700",
    client: "Visayas Auto",
    product: "Gear Lube 90",
    id: "ORD-2850",
    status: "Approved",
    statusStyle: "bg-green-50 text-green-700 border border-green-100",
    amount: "₱31,200",
  },
  {
    initials: "DI",
    color: "bg-amber-100 text-amber-700",
    client: "Davao Industrial",
    product: "Hydraulic Oil",
    id: "ORD-2849",
    status: "Invoiced",
    statusStyle: "bg-amber-50 text-amber-700 border border-amber-100",
    amount: "₱67,800",
  },
  {
    initials: "NL",
    color: "bg-purple-100 text-purple-700",
    client: "Negros Lube Dist.",
    product: "ATF Dexron III",
    id: "ORD-2848",
    status: "Delivered",
    statusStyle: "bg-purple-50 text-purple-700 border border-purple-100",
    amount: "₱58,400",
  },
];

function useCountUp(target, duration = 1400, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}

export default function OrderPipelineCard() {
  const [activeStage, setActiveStage] = useState(0);
  const [visible, setVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 },
    );
    if (cardRef.current) obs.observe(cardRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % stages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const orders142 = useCountUp(142, 1400, visible);
  const revenue84 = useCountUp(84, 1400, visible);
  const stock94 = useCountUp(94, 1400, visible);

  return (
    <div
      ref={cardRef}
      className="relative w-full"
      style={{
        borderRadius: "28px",
        boxShadow:
          "0 8px 40px 0 rgba(25,118,210,0.18), 0 2px 8px 0 rgba(25,118,210,0.08)",
        background: "#fff",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "4px",
          background:
            "linear-gradient(90deg, #0D47A1 0%, #1976D2 50%, #42A5F5 100%)",
        }}
      />

      <div className="p-5 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="font-bold tracking-widest text-xs text-[#0D47A1] uppercase">
            Order Pipeline
          </span>
          <div className="flex items-center gap-1.5 bg-green-50 border border-green-100 rounded-full px-2.5 py-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-[11px] font-medium text-green-700">Live</span>
          </div>
        </div>

        {/* Stage Tracker */}
        <div className="flex items-center">
          {stages.map((stage, i) => {
            const isCompleted = i < activeStage;
            const isActive = i === activeStage;
            const Icon = stage.icon;
            return (
              <div key={stage.label} className="contents">
                <div className="flex flex-col items-center gap-1.5 z-10">
                  <div
                    className="relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500"
                    style={{
                      background: isCompleted
                        ? "#0D47A1"
                        : isActive
                          ? "#1976D2"
                          : "#E3F2FD",
                      boxShadow: isActive
                        ? "0 0 0 4px rgba(25,118,210,0.18), 0 0 0 2px #1976D2"
                        : "none",
                    }}
                  >
                    <Icon
                      sx={{
                        fontSize: 16,
                        color: isCompleted || isActive ? "#fff" : "#90CAF9",
                      }}
                    />
                  </div>
                  <span
                    className="text-[10px] font-medium"
                    style={{
                      color: isCompleted || isActive ? "#0D47A1" : "#90CAF9",
                    }}
                  >
                    {stage.label}
                  </span>
                </div>

                {i < stages.length - 1 && (
                  <div className="flex-1 h-[2px] mx-1 mb-5 rounded-full overflow-hidden bg-[#E3F2FD]">
                    <div
                      className="h-full bg-[#1976D2] transition-all duration-700 ease-in-out"
                      style={{ width: i < activeStage ? "100%" : "0%" }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Order Rows */}
        <div className="space-y-2.5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50/70 hover:bg-blue-50/40 transition-colors"
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${order.color}`}
              >
                {order.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-gray-800 truncate">
                    {order.client}
                  </span>
                  <span className="font-bold text-xs text-[#0D47A1] flex-shrink-0">
                    {order.amount}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <span className="text-[10px] text-gray-400 truncate">
                    {order.product} · {order.id}
                  </span>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${order.statusStyle}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-gray-100">
          <div className="text-center py-2">
            <div className="font-bold text-xl text-[#0D47A1]">{orders142}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">
              Today's Orders
            </div>
            <div className="text-[10px] text-emerald-600 font-medium">
              ↑ 12%
            </div>
          </div>
          <div className="text-center py-2 border-x border-gray-100">
            <div className="font-bold text-xl text-[#0D47A1]">
              ₱{revenue84}K
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">Revenue</div>
            <div className="text-[10px] text-emerald-600 font-medium">↑ 8%</div>
          </div>
          <div className="text-center py-2">
            <div className="font-bold text-xl text-[#0D47A1]">{stock94}%</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Stock Level</div>
            <div className="text-[10px] text-emerald-600 font-medium">
              Healthy
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useEffect } from "react";
import { socket } from "@/socket";

export default function SocketInitializer({ userData }) {
  const companyId = userData?.company?.companyId;
  const userId = userData?.userId;
  useEffect(() => {
    if (companyId && userId) {
      if (!socket.connected) {
        socket.connect();
      }
      socket.emit("join_company", { companyId, userId });
    }
  }, [companyId, userId]);

  return null;
}

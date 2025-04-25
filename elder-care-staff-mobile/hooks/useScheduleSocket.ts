// src/hooks/useScheduleSocket.ts
import { useEffect } from "react";
import { useSocketStore } from "@/stores/socketStore";
import useScheduleStore from "@/stores/scheduleStore";
import { Schedule } from "@/types/Schedule";

export function useScheduleSocket(scheduleId: string,) {
  const socket = useSocketStore((state) => state.socket);
  const joinRoom = useSocketStore((state) => state.join);
  const leaveRoom = useSocketStore((state) => state.leave);
  const updateSchedule = useScheduleStore((state) => state.updateSchedule);

  useEffect(() => {
    if (!scheduleId || !socket) return;

    joinRoom(scheduleId);
    socket.on("schedule:statusUpdated", (data: Schedule) => {
      updateSchedule(data);
    });

    return () => {
      leaveRoom(scheduleId);
      socket.off("schedule:statusUpdated");
    };
  }, [scheduleId, socket]);
}

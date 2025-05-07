// // src/hooks/useScheduleSocket.ts
// import { useEffect } from "react";
// import { useSocketStore } from "../stores/socketStore";
// import useScheduleStore from "../stores/scheduleStore";
// import { Schedule } from "../types/schedule";

// export function useScheduleSocket(scheduleId: string,) {
//   const socket = useSocketStore((state) => state.socket);
//   const join = useSocketStore((state) => state.join);
//   const leave = useSocketStore((state) => state.leave);
//   const updateSchedule = useScheduleStore((state) => state.updateSchedule);

//   useEffect(() => {
//     if (!scheduleId || !socket) return;
//     join(`schedule_${scheduleId}`);
    
//     socket.on("schedule:statusUpdated", (data: Schedule) => {
//       updateSchedule(data);
//     });

//     return () => {
//       leave(scheduleId);
//       socket.off("schedule:statusUpdated");
//     };
//   }, [scheduleId, socket]);
// }

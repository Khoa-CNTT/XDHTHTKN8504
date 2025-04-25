// // import { Schedule } from "@/types/Schedule";
// import moment from "moment-timezone";

// export const getNearestSchedule = (schedules: Schedule[]) => {
//   const now = moment().tz("Asia/Ho_Chi_Minh"); // Lấy thời gian hiện tại tại Việt Nam

//   // Lọc các lịch chỉ trong tương lai (sau thời gian hiện tại)
//   const futureSchedules = schedules.filter((schedule) => {
//     const scheduleTime = moment(schedule.timeSlots.start).tz(
//       "Asia/Ho_Chi_Minh"
//     );
//     return scheduleTime.isAfter(now); // Chỉ lấy lịch sau thời gian hiện tại
//   });

//   // Nếu không có lịch nào trong tương lai, trả về null
//   if (futureSchedules.length === 0) {
//     console.log("Không có lịch nào trong tương lai.");
//     return null;
//   }

//   // Tìm lịch gần nhất (lịch có thời gian bắt đầu gần nhất với hiện tại)
//   const nearestSchedule = futureSchedules.reduce((nearest, current) => {
//     const nearestTime = moment(nearest.timeSlots.start).tz(
//       "Asia/Ho_Chi_Minh"
//     );
//     const currentTime = moment(current.timeSlots.start).tz(
//       "Asia/Ho_Chi_Minh"
//     );

//     // So sánh thời gian bắt đầu của hai lịch
//     return currentTime.isBefore(nearestTime) ? current : nearest;
//   });

//   return nearestSchedule;
// };

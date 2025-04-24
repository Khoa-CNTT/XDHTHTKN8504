export type ScheduleStatus =
  | "scheduled" // Đặt lịch xong, chưa ai sẵn sàng
  | "waiting_for_client" // Nhân viên đã sẵn sàng, chờ khách xác nhận
  | "waiting_for_nurse" // Khách hàng đã sẵn sàng, chờ nhân viên xác nhận
  | "on_the_way" // Nhân viên đang di chuyển
  | "check_in" // Nhân viên đã đến nơi
  | "in_progress" // Đang thực hiện chăm sóc
  | "check_out" // Đã hoàn tất, chờ xác nhận
  | "completed" // Khách xác nhận hoàn tất
  | "cancelled";             // Bị hủy bởi bất kỳ bên nào

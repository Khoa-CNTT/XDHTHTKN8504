//Login
http://localhost:5000/api/v1/auth/login

//Truy xuat thong tin chi tiet cua lich lam viec
http://localhost:5000/api/v1/schedules/{_id}/patient-profile
- _id là id của lịch làm việc cần truy xuất

//Xem danh sách công việc đã hoàn thành trong thàng
http://localhost:5000/api/v1/schedules/{_id}/completed-jobs?year=2025&month=04
- {_id} là id của người cần xem, test: 67ff9881aff90e490321e316

//Xem tổng tiền lương trong tháng 
http://localhost:5000/api/v1/salaries/monthly-salary?staffId={_id}&month=4&year=2025
- {_id} là id của người cần xem, test: 67ff9881aff90e490321e316
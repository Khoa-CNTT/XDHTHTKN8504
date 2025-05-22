import React, { useEffect } from "react";
import Layout from "../Layout"
import { CalendarIcon } from "lucide-react";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookingDetail } from "../store/bookingSlice";
import Loading from '../components/Loading'
import ErrorFallback from '../components/ErrorFallback'
import { useParams } from "react-router-dom";

const mockBooking = {
  _id: "booking123",
  profileId: {
    name: "Nguyễn Văn A",
  },
  serviceId: {
    name: "Khám tổng quát",
  },
  status: "accepted",
  notes: "Khách hàng yêu cầu bác sĩ nữ",
  paymentId: {
    method: "VNPay",
    amount: 1200000,
  },
  scheduleId: {
    date: "2025-05-25",
  },
  participants: [
    {
      userId: "user1",
      role: "doctor",
      fullName: "BS. Trần Thị B",
      acceptedAt: "2025-05-20T10:00:00Z",
    },
    {
      userId: "user2",
      role: "nurse",
      fullName: "Điều dưỡng Lê Văn C",
      acceptedAt: "2025-05-20T10:10:00Z",
    },
  ],
  repeatFrom: "2025-06-01",
  repeatTo: "2025-06-30",
  timeSlot: {
    start: "08:00",
    end: "09:00",
  },
  repeatInterval: 7,
  totalPrice: 1500000,
  totalDiscount: 300000,
  isRecurring: true,
  createdBy: {
    name: "Admin Phạm Minh",
  },
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  accepted: "bg-green-100 text-green-800",
  completed: "bg-gray-200 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

function PreviewBooking() {
  const { bookingDetail, bookingDetailLoading, bookingDetailError } = useSelector((state) => state.booking);
  const { _id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBookingDetail(_id));
  }, [dispatch, _id]);

  if (bookingDetailLoading) return <Loading />;
  if (bookingDetailError) return <ErrorFallback error={bookingDetailError} onRetry={() => dispatch(fetchBookingDetail(_id))} />;

  if (!bookingDetail) return null;

  const booking = bookingDetail;

  const tax = booking.totalPrice * 0.03;
  const total = booking.totalPrice - booking.totalDiscount + tax;

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString() : "";

  return (
    <Layout>
      <div className="p-6 space-y-8 max-w-6xl mx-auto bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">📋 Chi tiết lịch hẹn</h1>
          <span
            className={clsx(
              "px-4 py-1 rounded-full text-sm font-semibold shadow-sm",
              statusColors[booking.status] || "bg-gray-200 text-gray-600"
            )}
          >
            {booking.status.toUpperCase()}
          </span>
        </div>

        {/* Thông tin chính */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hồ sơ */}
          <div className="bg-white p-5 rounded-xl shadow-md flex gap-4 items-start border-l-4 border-emerald-500">
            <img
              src={booking.profileId?.avartar || booking.profileId?.avatar || "https://i.pravatar.cc/100"}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover border shadow"
            />
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-emerald-700">👤 Hồ sơ</h2>
              <p>
                <strong>Khách hàng:</strong>{" "}
                {booking.profileId
                  ? `${booking.profileId.firstName || ""} ${booking.profileId.lastName || ""}`
                  : "Chưa có thông tin"}
              </p>
              <p>
                <strong>Dịch vụ:</strong> {booking.serviceId?.name || "Chưa có thông tin"}
              </p>
              {/* <p>
                <strong>Người tạo:</strong>{" "}
                {typeof booking.createdBy === "string" ? booking.createdBy : booking.createdBy?.name || "Chưa có thông tin"}
              </p> */}
            </div>
          </div>

          {/* Lịch hẹn */}
          <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-blue-500 space-y-2">
            <h2 className="text-lg font-semibold text-blue-700">🕒 Lịch hẹn</h2>
            <p>
              <strong>Ngày:</strong>{" "}
              {formatDate(booking.scheduleId?.date) || formatDate(booking.repeatFrom)}
            </p>
            <p>
              <strong>Khung giờ:</strong> {booking.timeSlot?.start || ""} - {booking.timeSlot?.end || ""}
            </p>
            {/* <p>
              <strong>Lặp lại:</strong> {booking.isRecurring ? "Có" : "Không"}
            </p> */}
            <p>
              <strong>Từ:</strong> {formatDate(booking.repeatFrom)} → {formatDate(booking.repeatTo)}
            </p>
            <p>
              <strong>Mỗi:</strong> {booking.repeatInterval || 0} ngày
            </p>
          </div>
        </div>

        {/* Người tham gia */}
        <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-amber-500 space-y-3">
          <h2 className="text-lg font-semibold text-amber-700">👨‍⚕️ Người tham gia</h2>
          {booking.participants && booking.participants.length > 0 ? (
            <ul className="space-y-1 list-disc list-inside text-sm">
              {booking.participants.map((p) => (
                <li key={p.userId}>
                  {p.fullName} ({p.role === "doctor" ? "Bác sĩ" : "Điều dưỡng"}) – chấp nhận lúc{" "}
                  {new Date(p.acceptedAt).toLocaleString()}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">Chưa có người tham gia</p>
          )}
        </div>

        {/* Thanh toán */}
        <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-pink-500 space-y-3">
          <h2 className="text-lg font-semibold text-pink-700">💰 Thanh toán</h2>
          <p>
            <strong>Phương thức:</strong> {booking.paymentId?.method === "Wallet" ? "Ví ứng dụng" : "Chưa có thông tin"}
          </p>
          <p>
            <strong>Số tiền thanh toán:</strong>{" "}
            {(booking.paymentId?.amount || 0).toLocaleString()}₫
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mt-3">
            <div>
              <p className="text-gray-500">Tổng thu</p>
              <p className="font-bold text-gray-700">{(booking.totalPrice || 0).toLocaleString()}₫</p>
            </div>
            {/* <div>
              <p className="text-gray-500">Giảm giá</p>
              <p className="font-bold text-rose-600">
                -{(booking.totalDiscount || 0).toLocaleString()}₫
              </p>
            </div> */}
            <div>
              <p className="text-gray-500">Thuế (3%)</p>
              <p className="font-bold text-yellow-600">{tax.toLocaleString()}₫</p>
            </div>
            <div>
              <p className="text-gray-500">Tiền nhân viên thực nhận</p>
              <p className="font-bold text-emerald-600">{booking.totalDiscount.toLocaleString()}₫</p>
            </div>
          </div>
        </div>

        {/* Ghi chú */}
        <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-gray-400 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">📝 Ghi chú</h2>
          <div className="bg-gray-50 p-3 rounded border text-sm text-gray-600">
            {booking.notes || "Không có ghi chú thêm."}
          </div>
          {/* <div className="text-right">
            <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2 rounded-md shadow hover:scale-105 transition transform">
              Cập nhật
            </button>
          </div> */}
        </div>
      </div>
    </Layout >
  );
}


export default PreviewBooking;

import React, { useEffect } from "react";
import { MdOutlineCloudDownload } from "react-icons/md";
import { toast } from "react-hot-toast";
import { BiPlus } from "react-icons/bi";
import Layout from "../Layout";
import { Button } from "../components/Form";
import { BookingTable } from "../components/Tables";
import { doctorsData } from "../components/Datas";
import { useNavigate } from "react-router-dom";
import AddDoctorModal from "../components/Modals/AddDoctorModal";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookings } from "../store/bookingSlice.js";
import { deleteBooking } from "../store/bookingSlice.js";
import { getUserIdFromToken } from "../utils/jwtHelper.js";
import { io } from "socket.io-client";
import * as XLSX from "xlsx"; // Import xlsx library
import Loading from "../components/Loading.js";
import Paginate from "../utils/pagination.js";
const socket = io("http://localhost:5000");

function Booking() {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("newest");
  const [dateFilter, setDateFilter] = React.useState({ from: "", to: "" });
  const [filteredBookings, setFilteredBookings] = React.useState([]);


  const { bookings, loading, error, pagination } = useSelector((state) => state.booking);

  const [page, setPage] = React.useState(1);
  const limit = 10;

  React.useEffect(() => {
    let temp = [...bookings];

    // 1. Tìm kiếm theo tên khách hàng
    if (searchTerm.trim() !== "") {
      temp = temp.filter((b) => {
        const fullName = `${b?.profileId?.firstName || ""} ${b?.profileId?.lastName || ""}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      });
    }

    // 2. Lọc theo ngày
    if (dateFilter.from) {
      const fromDate = new Date(dateFilter.from);
      temp = temp.filter((b) => new Date(b.createdAt) >= fromDate);
    }

    if (dateFilter.to) {
      const toDate = new Date(dateFilter.to);
      temp = temp.filter((b) => new Date(b.createdAt) <= toDate);
    }

    // 3. Sắp xếp theo ngày bắt đầu
    temp.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      if (isNaN(dateA) || isNaN(dateB)) return 0;

      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredBookings(temp);
  }, [bookings, searchTerm, sortOrder, dateFilter]);

  useEffect(() => {
    dispatch(fetchBookings({ page, limit }));

    const user = getUserIdFromToken();
    // console.log("user", user);

    if (user) {
      socket.emit("join", {
        role: user.role,
      });
    }
    socket.on("newBookingCreated", (newBooking) => {
      console.log("📥 Booking mới! Gọi lại fetchBookings");
      dispatch(fetchBookings({ page, limit }));
    });

    // Cleanup khi component unmount
    return () => {
      socket.off("newBookingCreated");
    };
  }, [dispatch, page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (loading) return <Loading />;
  if (error) return <p>Lỗi: {error.message}</p>;

  console.log("bookings", bookings);

  const onCloseModal = () => {
    setIsOpen(false);
  };

  const preview = (data) => {
    navigate(`/nurses/preview/${data.id}`);
  };
  //export excel
  const handleExport = () => {
    // Tạo worksheet từ dữ liệu bookings
    const ws = XLSX.utils.json_to_sheet(
      bookings.map((booking, index) => ({
        "#": index + 1,
        "Khách hàng": `${booking?.profileId?.firstName || "Ẩn"} ${booking?.profileId?.lastName || ""
          }`,
        "Người thực hiện": booking?.participants?.[0]?.fullName || "Chưa có",
        "Ngày bắt đầu": new Date(booking?.repeatFrom).toLocaleDateString(
          "vi-VN"
        ),
        "Ngày kết thúc": new Date(booking?.repeatTo).toLocaleDateString(
          "vi-VN"
        ),
        "Dịch vụ": booking?.serviceId?.name || "Không rõ",
        "Trạng thái": booking.status,
      }))
    );

    // Tạo workbook và thêm worksheet vào
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bookings");

    // Tạo file excel dưới dạng nhị phân
    const excelFile = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    // Tạo một Blob và kích hoạt tải về
    const file = new Blob([s2ab(excelFile)], {
      type: "application/octet-stream",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = "bookings.xlsx";
    link.click();
  };
  // Chuyển đổi chuỗi thành ArrayBuffer (để tạo file Excel nhị phân)
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  };

  const previewBooking = (_id) => {
    navigate(`/bookings/preview1/${_id}`);
  };

  return (
    <Layout>
      {
        // add doctor modal
        isOpen && (
          <AddDoctorModal
            closeModal={onCloseModal}
            isOpen={isOpen}
            doctor={true}
            datas={null}
          />
        )
      }
      {/* add button */}
      {/* <button
        onClick={() => setIsOpen(true)}
        className="w-16 animate-bounce h-16 border border-border z-50 bg-subMain text-white rounded-full flex-colo fixed bottom-8 right-12 button-fb"
      >
        <BiPlus className="text-2xl" />
      </button> */}
      {/* payroll */}

      {/*  */}
      <h1 className="text-xl font-semibold">Booking</h1>
      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="100"
        data-aos-offset="200"
        className="bg-white my-8 rounded-xl border-[1px] border-border p-5"
      >
        {/* datas */}

        <div className="grid md:grid-cols-6 sm:grid-cols-2 grid-cols-1 gap-2">
          <div className="md:col-span-5 grid lg:grid-cols-4 items-center gap-6">
            {/* <input
              type="text"
              placeholder='Search "daudi mburuge"'
              className="h-14 w-full text-sm text-main rounded-md bg-dry border border-border px-4"
            /> */}
            <input
              type="text"
              placeholder="Tìm kiếm theo tên khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-14 text-sm text-main rounded-md bg-dry border border-border px-4"
            />

            {/* Sắp xếp */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="h-14 w-full text-xs text-main rounded-md bg-dry border border-border px-4 flex items-center justify-between"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
            </select>

            {/* Lọc ngày từ */}
            <input
              type="date"
              value={dateFilter.from}
              onChange={(e) => setDateFilter(prev => ({ ...prev, from: e.target.value }))}
              className="text-xs px-4 h-14 border border-border text-main font-normal rounded-lg focus:border focus:border-subMain"
            />

            {/* Lọc ngày đến */}
            <input
              type="date"
              value={dateFilter.to}
              onChange={(e) => setDateFilter(prev => ({ ...prev, to: e.target.value }))}
              className="text-xs px-4 h-14 border border-border text-main font-normal rounded-lg focus:border focus:border-subMain"
            />
          </div>

          {/* export */}
          {/* Nút xuất dữ liệu */}
          <Button
            label="Export"
            Icon={MdOutlineCloudDownload}
            onClick={handleExport}
          />
        </div>
        <div className="mt-8 w-full overflow-x-scroll">
          <BookingTable
            doctor={true}
            data={filteredBookings}
            page={page}
            limit={limit}
            functions={{
              preview: previewBooking,
              onDelete: (id) => {
                dispatch(deleteBooking(id));
              },
            }}
          />
        </div>
        <Paginate
          page={page}
          totalPages={pagination?.totalPages || 1}
          onPageChange={handlePageChange}
        />
      </div>
    </Layout>
  );
}

export default Booking;

import React, { useState } from "react";
import Layout from "../../Layout";
import { Button, FromToDate, Select } from "../../components/Form";
import { Transactiontable } from "../../components/Tables";
import { sortsDatas, transactionData } from "../../components/Datas";
import { BiChevronDown, BiTime } from "react-icons/bi";
import {
  MdFilterList,
  MdOutlineCalendarMonth,
  MdOutlineCloudDownload,
} from "react-icons/md";
import { toast } from "react-hot-toast";
import { BsCalendarMonth } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { fetchAllPayment, fetchPaymentCounts } from "../../store/paymentSlice";
import * as XLSX from "xlsx"; // THÊM: import thư viện xuất Excel
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import Loading from "../../components/Loading";
import Paginate from "../../utils/pagination.js";

function Payments() {
  const [status, setStatus] = useState(sortsDatas.status[0]);
  const [method, setMethod] = useState(sortsDatas.method[0]);

  // Search & filter states
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("newest");
  const [dateFilter, setDateFilter] = React.useState({ from: "", to: "" });
  const [filteredData, setFilteredData] = React.useState([]);

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 10;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    allPayments: payments,
    paymentCounts,
    loading,
    error,
    pagination
  } = useSelector((state) => state.payment);

  useEffect(() => {
    dispatch(fetchAllPayment({ page, limit }));
    dispatch(fetchPaymentCounts());
  }, [dispatch, page]);

  useEffect(() => {
    let temp = [...payments]; // Thay vì data, dùng payments

    // Tìm kiếm theo tên trong bookingId.profileId.firstName + lastName
    if (searchTerm.trim() !== "") {
      temp = temp.filter((item) => {
        const profile = item.bookingId?.profileId;
        const fullName = `${profile?.firstName || ""} ${profile?.lastName || ""}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      });
    }

    // Lọc theo ngày trong item.createdAt
    if (dateFilter.from) {
      const fromDate = new Date(dateFilter.from);
      temp = temp.filter((item) => {
        const created = new Date(item.createdAt);
        return created >= fromDate;
      });
    }

    if (dateFilter.to) {
      const toDate = new Date(dateFilter.to);
      temp = temp.filter((item) => {
        const created = new Date(item.createdAt);
        return created <= toDate;
      });
    }

    // Sắp xếp theo createdAt
    temp.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredData(temp);
  }, [payments, searchTerm, dateFilter, sortOrder]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (loading) return <Loading />;
  if (error) return <p>Lỗi: {error}</p>;

  const boxes = [
    {
      id: 1,
      title: "Today Payments",
      value: paymentCounts?.today,
      color: ["bg-subMain", "text-subMain"],
      icon: BiTime,
    },
    {
      id: 2,
      title: "Monthly Payments",
      value: paymentCounts?.month,
      color: ["bg-orange-500", "text-orange-500"],
      icon: BsCalendarMonth,
    },
    {
      id: 3,
      title: "Yearly Payments",
      value: paymentCounts?.year,
      color: ["bg-green-500", "text-green-500"],
      icon: MdOutlineCalendarMonth,
    },
  ];

  const editPayment = (_id) => {
    navigate(`/payments/edit/${_id}`);
  };

  const previewPayment = (_id) => {
    navigate(`/payments/preview/${_id}`);
  };

  // console.log("pay", payments);
  console.log("count", paymentCounts);

  // 🔹 Chuyển chuỗi sang ArrayBuffer
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  };

  // 🔹 Hàm xuất Excel
  const handleExport = () => {
    if (!transactionData || transactionData.length === 0) {
      toast.error("Không có dữ liệu để xuất");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(
      transactionData.map((item, index) => ({
        "#": index + 1,
        "Mã giao dịch": item.id || "",
        "Khách hàng": item.customer || "",
        "Phương thức": item.method || "",
        "Số tiền": item.amount || "",
        "Trạng thái": item.status || "",
        "Ngày thanh toán": item.date || "",
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payments");

    const excelFile = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    const file = new Blob([s2ab(excelFile)], {
      type: "application/octet-stream",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = "payments.xlsx";
    link.click();
  };

  return (
    <Layout>
      {/* Export Excel */}
      <button
        onClick={handleExport}
        className="w-16 hover:w-44 group transitions hover:h-14 h-16 border border-border z-50 bg-subMain text-white rounded-full flex-rows gap-4 fixed bottom-8 right-12 button-fb"
      >
        <p className="hidden text-sm group-hover:block">Export</p>
        <MdOutlineCloudDownload className="text-2xl" />
      </button>

      <h1 className="text-xl font-semibold">Payments</h1>

      {/* Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {boxes.map((box) => (
          <div
            key={box.id}
            className="bg-white flex-btn gap-4 rounded-xl border-[1px] border-border p-5"
          >
            <div className="w-3/4">
              <h2 className="text-sm font-medium">{box.title}</h2>
              <h2 className="text-xl my-6 font-medium">{box.value}</h2>
              <p className="text-xs text-textGray">
                You made <span className={box.color[1]}>{box.value}</span>{" "}
                transactions{" "}
                {box.title === "Today Payments"
                  ? "today"
                  : box.title === "Monthly Payments"
                    ? "this month"
                    : "this year"}
              </p>
            </div>
            <div
              className={`w-10 h-10 flex-colo rounded-md text-white text-md ${box.color[0]}`}
            >
              <box.icon />
            </div>
          </div>
        ))}
      </div>

      {/* Filters + Table */}
      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="10"
        data-aos-offset="200"
        className="bg-white my-8 rounded-xl border-[1px] border-border p-5"
      >
        <div className="grid lg:grid-cols-5 grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2">
          <div className="md:col-span-5 grid lg:grid-cols-4 items-center gap-6">
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
        </div>

        {/* Table */}
        <div className="mt-8 w-full overflow-x-scroll">
          <Transactiontable
            data={filteredData}
            page={page}
            limit={limit}
            functions={{ preview: previewPayment, edit: editPayment }}
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

export default Payments;

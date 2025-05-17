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

function Payments() {
  const [status, setStatus] = useState(sortsDatas.status[0]);
  const [method, setMethod] = useState(sortsDatas.method[0]);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;
  const navigate = useNavigate();
  const { allPayments: payments, paymentCounts, loading, error } = useSelector((state) => state.payment)
  const dispatch = useDispatch();

  const sorts = [
    {
      id: 2,
      selected: status,
      setSelected: setStatus,
      datas: sortsDatas.status,
    },
    {
      id: 3,
      selected: method,
      setSelected: setMethod,
      datas: sortsDatas.method,
    },
  ];
  
  useEffect(() => {
    dispatch(fetchAllPayment());
    dispatch(fetchPaymentCounts());
  }, [dispatch])

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

      <h1 className="text-xl font-semibold">Thanh toán</h1>

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
          <input
            type="text"
            placeholder='Search "Customers"'
            className="h-14 text-sm text-main rounded-md bg-dry border border-border px-4"
          />
          {sorts.map((item) => (
            <Select
              key={item.id}
              selectedPerson={item.selected}
              setSelectedPerson={item.setSelected}
              datas={item.datas}
            />
          ))}
        </div>

        {/* Table */}
        <div className="mt-8 w-full overflow-x-scroll">
          <Transactiontable
            data={payments}
            functions={{ preview: previewPayment, edit: editPayment }}
          />
        </div>
      </div>
    </Layout>
  );
}

export default Payments;

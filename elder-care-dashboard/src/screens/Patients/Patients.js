import React, { useState, useEffect } from "react";
import Layout from "../../Layout";
import { memberData, sortsDatas } from "../../components/Datas";
import { Link, useNavigate } from "react-router-dom";
import { BiChevronDown, BiPlus, BiTime } from "react-icons/bi";
import { BsCalendarMonth } from "react-icons/bs";
import { MdFilterList, MdOutlineCalendarMonth } from "react-icons/md";
import { toast } from "react-hot-toast";
import { Button, FromToDate, Select } from "../../components/Form";
import { PatientTable } from "../../components/Tables";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCustomers,
  deleteCustomerByAdmin,
  fetchCustomerCounts,
  searchCustomers,
} from "../../store/customerSlice.js";
import { getUserIdFromToken } from "../../utils/jwtHelper.js";
import { io } from "socket.io-client";
import axios from "axios";
import Loading from "../../components/Loading.js";
import Paginate from "../../utils/pagination.js";

const socket = io("http://localhost:5000");

function Patients() {
  const [status, setStatus] = useState(sortsDatas.filterPatient[0]);
  const [gender, setGender] = useState(sortsDatas.genderFilter[0]);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;
  const navigate = useNavigate();
  const { data, counts, loading, error, pagination } = useSelector(
    (state) => state.customers
  );
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" });
  const [filteredData, setFilteredData] = useState([]);

  const [page, setPage] = React.useState(1);
  const limit = 10;

  // console.log(gender.name);

  // boxes
  const boxes = [
    {
      id: 1,
      title: "Customers Today",
      value: counts?.today,
      color: ["bg-subMain", "text-subMain"],
      icon: BiTime,
    },
    {
      id: 2,
      title: "Monthly Customers",
      value: counts?.month,
      color: ["bg-orange-500", "text-orange-500"],
      icon: BsCalendarMonth,
    },
    {
      id: 3,
      title: "Yearly Customers",
      value: counts?.year,
      color: ["bg-green-500", "text-green-500"],
      icon: MdOutlineCalendarMonth,
    },
  ];

  useEffect(() => {
    let temp = [...data];

    // Tìm kiếm theo tên
    if (searchTerm.trim() !== "") {
      temp = temp.filter((item) => {
        const profile = item.profiles[0];
        const fullName = `${profile?.firstName || ""} ${profile?.lastName || ""}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      });
    }

    // Lọc theo ngày
    if (dateFilter.from) {
      const fromDate = new Date(dateFilter.from);
      temp = temp.filter((item) => {
        const created = new Date(item.profiles[0]?.createdAt || item.createdAt);
        return created >= fromDate;
      });
    }

    if (dateFilter.to) {
      const toDate = new Date(dateFilter.to);
      temp = temp.filter((item) => {
        const created = new Date(item.profiles[0]?.createdAt || item.createdAt);
        return created <= toDate;
      });
    }

    // Sắp xếp
    temp.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredData(temp);
  }, [data, searchTerm, dateFilter, sortOrder]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // preview
  const previewPayment = (_id) => {
    navigate(`/customers/preview/${_id}`);
  };

  useEffect(() => {
    dispatch(fetchCustomers({ page, limit }));
    dispatch(fetchCustomerCounts());

    const user = getUserIdFromToken();

    if (user) {
      socket.emit("join", {
        role: user.role,
      });
    }

    socket.on("newFamilyMember", (newFamilyMember) => {
      console.log("📥 Family member mới! Gọi lại fetchCustomers");
      dispatch(fetchCustomers());
    });

    // Cleanup để tránh leak và gọi trùng
    return () => {
      socket.off("newFamilyMember");
    };
  }, [dispatch]);

  // console.log("data", data);
  // console.log("countsCT", counts);

  if (loading) return <Loading />;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <Layout>
      {/* add button */}
      <Link
        to="/customers/create"
        className="w-16 animate-bounce h-16 border border-border z-50 bg-subMain text-white rounded-full flex-colo fixed bottom-8 right-12 button-fb"
      >
        <BiPlus className="text-2xl" />
      </Link>
      <h1 className="text-xl font-semibold">Customers</h1>
      {/* boxes */}
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
                Total Customers{" "}
                <span className={box.color[1]}>{box.value}</span>{" "}
                {box.title === "Khách hàng hôm nay"
                  ? "Today"
                  : box.title === "Khách hàng hàng tháng"
                    ? "This Month"
                    : "This Year"}
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
      {/* datas */}
      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="10"
        data-aos-offset="200"
        className="bg-white my-8 rounded-xl border-[1px] border-border p-5"
      >
        <div className="md:col-span-5 grid lg:grid-cols-4 items-center gap-6 mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-14 text-sm text-main rounded-md bg-dry border border-border px-4"
          />

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="h-14 w-full text-xs text-main rounded-md bg-dry border border-border px-4 flex items-center justify-between"
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
          </select>

          <input
            type="date"
            value={dateFilter.from}
            onChange={(e) => setDateFilter(prev => ({ ...prev, from: e.target.value }))}
            className="text-xs px-4 h-14 border border-border text-main font-normal rounded-lg focus:border focus:border-subMain"
          />

          <input
            type="date"
            value={dateFilter.to}
            onChange={(e) => setDateFilter(prev => ({ ...prev, to: e.target.value }))}
            className="text-xs px-4 h-14 border border-border text-main font-normal rounded-lg focus:border focus:border-subMain"
          />
        </div>
        <div className="mt-8 w-full overflow-x-scroll">
          <PatientTable
            data={filteredData}
            page={page}
            limit={limit}
            functions={{
              preview: previewPayment,
              onDelete: (id) => {
                dispatch(deleteCustomerByAdmin(id));
              },
            }}
            used={false}
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

export default Patients;

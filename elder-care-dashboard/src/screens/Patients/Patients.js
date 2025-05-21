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
import { fetchCustomers, deleteCustomerByAdmin, fetchCustomerCounts, searchCustomers } from "../../store/customerSlice.js";
import { getUserIdFromToken } from "../../utils/jwtHelper.js";
import { io } from "socket.io-client";
import axios from "axios";
import Loading from "../../components/Loading.js";

const socket = io("http://localhost:5000");

function Patients() {
  const [status, setStatus] = useState(sortsDatas.filterPatient[0]);
  const [gender, setGender] = useState(sortsDatas.genderFilter[0]);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;
  const navigate = useNavigate();
  const { data, counts, loading, error } = useSelector((state) => state.customers);
  const dispatch = useDispatch();

  const sorts = [
    {
      id: 2,
      selected: status,
      setSelected: setStatus,
      datas: sortsDatas.filterPatient,
    },
    {
      id: 3,
      selected: gender,
      setSelected: setGender,
      datas: sortsDatas.genderFilter,
    },
  ];
  console.log(gender.name);


  // boxes
  const boxes = [
    {
      id: 1,
      title: "Khách hàng hôm nay",
      value: counts?.today,
      color: ["bg-subMain", "text-subMain"],
      icon: BiTime,
    },
    {
      id: 2,
      title: "Khách hàng hàng tháng",
      value: counts?.month,
      color: ["bg-orange-500", "text-orange-500"],
      icon: BsCalendarMonth,
    },
    {
      id: 3,
      title: "Khách hàng hàng năm",
      value: counts?.year,
      color: ["bg-green-500", "text-green-500"],
      icon: MdOutlineCalendarMonth,
    },
  ];

  // preview
  const previewPayment = (_id) => {
    navigate(`/customers/preview/${_id}`);
  };

  useEffect(() => {
    dispatch(fetchCustomers());
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

  const handleFilter = () => {
    const queryParams = {};

    if (gender.name !== "Giới tính...") {
      queryParams.gender = gender.name;
    }

    if (status.name === "khách hàng mới nhất") {
      queryParams.sort = "newest";
    } else if (status.name === "khách hàng cũ nhất") {
      queryParams.sort = "oldest";
    }

    if (startDate && endDate) {
      queryParams.startDate = new Date(startDate).toISOString();
      queryParams.endDate = new Date(endDate).toISOString();
    }

    dispatch(searchCustomers(queryParams));
  };

  return (
    <Layout>
      {/* add button */}
      <Link
        to="/customers/create"
        className="w-16 animate-bounce h-16 border border-border z-50 bg-subMain text-white rounded-full flex-colo fixed bottom-8 right-12 button-fb"
      >
        <BiPlus className="text-2xl" />
      </Link>
      <h1 className="text-xl font-semibold">Khách hàng</h1>
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
                Tổng Khách hàng{" "}
                <span className={box.color[1]}>{box.value}</span>{" "}
                {box.title === "Khách hàng hôm nay"
                  ? "hôm nay"
                  : box.title === "Khách hàng hàng tháng"
                    ? "tháng này"
                    : "năm này"}
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
        <div className="grid lg:grid-cols-5 grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2">
          <input
            type="text"
            placeholder='Tìm kiếm "Khách hàng"'
            className="h-14 text-sm text-main rounded-md bg-dry border border-border px-4"
          />
          {/* sort  */}
          {sorts.map((item) => (
            <Select
              key={item.id}
              selectedPerson={item.selected}
              setSelectedPerson={item.setSelected}
              datas={item.datas}
            >
              <div className="h-14 w-full text-xs text-main rounded-md bg-dry border border-border px-4 flex items-center justify-between">
                <p>{
                  item.selected.name === "male"
                    ? "Nam"
                    : item.selected.name === "female"
                      ? "Nữ"
                      : item.selected.name
                }</p>
                <BiChevronDown className="text-xl" />
              </div>
            </Select>
          ))}
          {/* date */}
          <FromToDate
            startDate={startDate}
            endDate={endDate}
            bg="bg-dry"
            onChange={(update) => setDateRange(update)}
          />
          {/* export */}
          <Button
            label="Filter"
            Icon={MdFilterList}
            onClick={handleFilter}
          />
        </div>
        <div className="mt-8 w-full overflow-x-scroll">
          <PatientTable
            data={data}
            functions={{
              preview: previewPayment,
              onDelete: (id) => {
                dispatch(deleteCustomerByAdmin(id));
              },
            }}
            used={false}
          />
        </div>
      </div>
    </Layout>
  );
}

export default Patients;

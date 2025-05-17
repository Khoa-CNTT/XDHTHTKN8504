import React, { useEffect, useState } from "react";
import { MdOutlineCloudDownload } from "react-icons/md";
import { toast } from "react-hot-toast";
import { BiPlus } from "react-icons/bi";
import Layout from "../../Layout";
import { Button } from "../../components/Form";
import { DoctorsTable } from "../../components/Tables";
import { doctorsData } from "../../components/Datas";
import { useNavigate } from "react-router-dom";
import AddDoctorModal from "../../components/Modals/AddDoctorModal";
import AddUserStaffModal from "../../components/Modals/AddUserStaffModal.js";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchStaffList } from "../../store/staffSlice.js";
import { getUserIdFromToken } from "../../utils/jwtHelper.js";
import { deleteStaff } from "../../store/staffSlice.js";
import { io } from "socket.io-client";
import * as XLSX from "xlsx"; // Import xlsx library
import Loading from "../../components/Loading.js";
import AddEditStaffModal from "../../components/Modals/AddEditStaffModal";
const socket = io("http://localhost:5000");

function Staffs() {
  const [isOpen, setIsOpen] = React.useState(false);

  const [data, setData] = React.useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showModal1, setShowModal1] = React.useState(false);
  const [showModal2, setShowModal2] = React.useState(false);

  const handleOpenModal1 = () => setShowModal1(true);
  const handleCloseModal2 = () => setShowModal2(false);
  const [selectedId, setSelectedId] = useState(null);
  const { staffList, loading, error } = useSelector((state) => state.staff);

  const handleSuccessFromModal1 = (idFromModal1) => {
    setSelectedId(idFromModal1); // lưu id
    setShowModal1(false); // đóng modal 1
    setShowModal2(true); // mở modal 2
  };
  const onCloseModal = () => {
    setIsOpen(false);
    setData({});
  };
  const onEdit = (datas) => {
    setIsOpen(true);
    setData(datas);
  };
  useEffect(() => {
    dispatch(fetchStaffList());

    const user = getUserIdFromToken();

    if (user) {
      socket.emit("join", {
        role: user.role,
      });
      // console.log("socket join", user);
    }
    socket.on("newStaffCreated", (newStaff) => {
      console.log("📥 Staff mới! Gọi lại fetchStaffList");
      dispatch(fetchStaffList());
    });

    return () => {
      socket.off("newStaffCreated");
    };
  }, [dispatch]);

  useEffect(() => {
    if (staffList.length > 0) {
      console.log("staffList:", staffList);
    }
  }, [staffList]);

  if (loading) return <Loading />;
  if (error) return <p>Lỗi: {error.message}</p>;

  // const onCloseModal = () => {
  //   setIsOpen(false);
  // };

  const preview = (data) => {
    navigate(`/staffs/preview/${data.id}`);
  };

  const handleExport = () => {
    if (!staffList || staffList.length === 0) {
      toast.error("Không có dữ liệu để xuất!");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(
      staffList.map((item, index) => ({
        "#": index + 1,
        "Họ và tên": `${item.firstName || ""} ${item.lastName || ""}`,
        "Ngày Tạo": new Date(item.createdAt).toLocaleDateString("vi-VN"),
        "Điện Thoại": item.userId?.phone || "Không rõ",
        "Chức Danh":
          item.type === "doctor"
            ? "Bác sĩ"
            : item.type === "nurse"
            ? "Điều dưỡng"
            : "Không xác định",
        Email: item.email || "Không rõ",
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Staffs");

    const excelFile = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    const s2ab = (s) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xff;
      }
      return buf;
    };

    const file = new Blob([s2ab(excelFile)], {
      type: "application/octet-stream",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = "staffs.xlsx";
    link.click();
  };

  const previewStaff = (_id) => {
    navigate(`/staffs/preview/${_id}`);
  };

  return (
    <Layout>
      <div>
        <AddUserStaffModal
          closeModal={() => setShowModal1(false)}
          isOpen={showModal1}
          doctor={true}
          datas={null}
          onSuccess={handleSuccessFromModal1}
        />

        <AddDoctorModal
          closeModal={handleCloseModal2}
          isOpen={showModal2}
          doctor={true}
          datas={null}
          id={selectedId}
        />
      </div>
      {isOpen && (
        <AddEditStaffModal
          datas={data}
          isDoctor={data?.type === "doctor"}
          isOpen={isOpen}
          onClose={onCloseModal}
        />
      )}

      {/* Add button */}
      <button
        onClick={handleOpenModal1}
        className="w-16 animate-bounce h-16 border border-border z-50 bg-subMain text-white rounded-full flex-colo fixed bottom-8 right-12 button-fb"
      >
        <BiPlus className="text-2xl" />
      </button>

      <h1 className="text-xl font-semibold">Nhân viên</h1>
      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="100"
        data-aos-offset="200"
        className="bg-white my-8 rounded-xl border-[1px] border-border p-5"
      >
        {/* Search input */}
        <div className="grid md:grid-cols-6 sm:grid-cols-2 grid-cols-1 gap-2">
          <div className="md:col-span-5 grid lg:grid-cols-4 items-center gap-6">
            <input
              type="text"
              placeholder='Search "daudi mburuge"'
              className="h-14 w-full text-sm text-main rounded-md bg-dry border border-border px-4"
            />
          </div>

          {/* Export button */}
          <Button
            label="Export"
            Icon={MdOutlineCloudDownload}
            onClick={handleExport}
          />
        </div>

        <div className="mt-8 w-full overflow-x-scroll">
          <DoctorsTable
            doctor={true}
            data={staffList}
            onEdit={onEdit}
            functions={{
              preview: previewStaff,
              onDelete: (id) => {
                dispatch(deleteStaff(id));
              },
            }}
          />
        </div>
      </div>
    </Layout>
  );
}

export default Staffs;

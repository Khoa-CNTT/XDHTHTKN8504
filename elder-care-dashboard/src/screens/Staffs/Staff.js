import React, { useEffect } from "react";
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
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function Staffs() {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { staffList, loading, error } = useSelector((state) => state.staff);

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

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  const onCloseModal = () => {
    setIsOpen(false);
  };

  const preview = (data) => {
    navigate(`/nurses/preview/${data.id}`);
  };

  return (
    <Layout>
      {
        // add doctor modal
        isOpen && (
          <AddUserStaffModal
            closeModal={onCloseModal}
            isOpen={isOpen}
            doctor={true}
            datas={null}
          />
        )
      }
      {/* add button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-16 animate-bounce h-16 border border-border z-50 bg-subMain text-white rounded-full flex-colo fixed bottom-8 right-12 button-fb"
      >
        <BiPlus className="text-2xl" />
      </button>
      {/* payroll */}

      {/*  */}
      <h1 className="text-xl font-semibold">Nhân viên</h1>
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
            <input
              type="text"
              placeholder='Search "daudi mburuge"'
              className="h-14 w-full text-sm text-main rounded-md bg-dry border border-border px-4"
            />
          </div>
          {/* Link chuyển đến trang thanh toán chung */}
          {/* <div className="md:col-span-5 grid  items-center gap-4 bg-subMain text-white text-sm font-medium px-2 py-2 rounded w-fit">
            <Link
              to="/nurses/payroll"
              className="text-white  px-4 py-2 rounded-md text-sm font-semibold"
            >
              Go to Payroll
            </Link>
          </div> */}

          {/* export */}
          <Button
            label="Export"
            Icon={MdOutlineCloudDownload}
            onClick={() => {
              toast.error("Exporting is not available yet");
            }}
          />
        </div>
        <div className="mt-8 w-full overflow-x-scroll">
          <DoctorsTable
            doctor={true}
            data={staffList}
            functions={{
              preview: preview,
            }}
          />
        </div>
      </div>
    </Layout>
  );
}

export default Staffs;

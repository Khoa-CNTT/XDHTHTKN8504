import React, { useState, useEffect } from "react";
import { MdOutlineCloudDownload } from "react-icons/md";
import { BiChevronDown, BiPlus } from "react-icons/bi";
import Layout from "../Layout";
import { Button, Select } from "../components/Form";
import { ServiceTable } from "../components/Tables";
import { servicesData, sortsDatas } from "../components/Datas";
import AddEditServiceModal from "../components/Modals/AddEditServiceModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices } from "../store/serviceSlice";
import { getUserIdFromToken } from "../utils/jwtHelper.js";
import { io } from "socket.io-client";
import * as XLSX from "xlsx"; // Import xlsx library

const socket = io("http://localhost:5000");

function Services() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [data, setData] = React.useState({});
  const [status, setStatus] = React.useState(sortsDatas.service[0]);
  const dispatch = useDispatch();
  const { services, loading, error } = useSelector((state) => state.service);

  const onCloseModal = () => {
    setIsOpen(false);
    setData({});
  };

  const onEdit = (datas) => {
    setIsOpen(true);
    setData(datas);
  };

  useEffect(() => {
    dispatch(fetchServices());

    const user = getUserIdFromToken();

    if (user) {
      socket.emit("join", {
        role: user.role,
      });
      socket.on("newServiceCreated", (newService) => {
        console.log("📥 Service mới!");
        dispatch(fetchServices());
      });

      // Cleanup khi component unmount
      return () => {
        socket.off("newServiceCreated");
      };
    }
  }, [dispatch]);

  // Hàm xuất Excel
  const handleExport = () => {
    // Tạo worksheet từ dữ liệu services
    const ws = XLSX.utils.json_to_sheet(
      services.map((service, index) => ({
        "#": index + 1,
        "Tên dịch vụ": service.name || "Không rõ",
        "Loại dịch vụ": service.category || "Không rõ",
        Giá: service.price || "Không rõ",
        "Trạng thái": service.status || "Chưa cập nhật",
      }))
    );

    // Tạo workbook và thêm worksheet vào
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Services");

    // Tạo file excel dưới dạng nhị phân
    const excelFile = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    // Tạo một Blob và kích hoạt tải về
    const file = new Blob([s2ab(excelFile)], {
      type: "application/octet-stream",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = "services.xlsx";
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

  return (
    <Layout>
      {isOpen && (
        <AddEditServiceModal
          datas={data}
          isOpen={isOpen}
          closeModal={onCloseModal}
        />
      )}
      {/* add button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-16 animate-bounce h-16 border border-border z-50 bg-subMain text-white rounded-full flex-colo fixed bottom-8 right-12 button-fb"
      >
        <BiPlus className="text-2xl" />
      </button>
      {/*  */}
      <h1 className="text-xl font-semibold">Services</h1>
      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="100"
        data-aos-offset="200"
        className="bg-white my-8 rounded-xl border-[1px] border-border p-5"
      >
        {/* datas */}

        <div className="grid md:grid-cols-6 grid-cols-1 gap-2">
          <div className="md:col-span-5 grid lg:grid-cols-4 xs:grid-cols-2 items-center gap-2">
            <input
              type="text"
              placeholder='Search "teeth cleaning"'
              className="h-14 w-full text-sm text-main rounded-md bg-dry border border-border px-4"
            />
            <Select
              selectedPerson={status}
              setSelectedPerson={setStatus}
              datas={sortsDatas.service}
            >
              <div className="w-full flex-btn text-main text-sm p-4 border bg-dry border-border font-light rounded-lg focus:border focus:border-subMain">
                {status.name} <BiChevronDown className="text-xl" />
              </div>
            </Select>
          </div>

          {/* export */}
          <Button
            label="Export"
            Icon={MdOutlineCloudDownload}
            onClick={handleExport} // Gọi handleExport khi nhấn
          />
        </div>
        <div className="mt-8 w-full overflow-x-scroll">
          <ServiceTable data={services} onEdit={onEdit} />
        </div>
      </div>
    </Layout>
  );
}

export default Services;

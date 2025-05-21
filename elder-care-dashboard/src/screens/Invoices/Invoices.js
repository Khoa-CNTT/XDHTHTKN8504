import React, { useEffect } from "react";
import Layout from "../../Layout";
import { Button } from "../../components/Form";
import { MdOutlineCloudDownload } from "react-icons/md";
import { toast } from "react-hot-toast";
import { InvoiceTable } from "../../components/Tables";
import { invoicesData } from "../../components/Datas";
import { BiPlus } from "react-icons/bi";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx"; 
import { fetchInvoice } from "../../store/invoiceSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../components/Loading";

function Invoices() {
  const { data, loading, error } = useSelector((state) => state.invoice);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchInvoice());
  }, [dispatch]);

  if(loading) return <Loading />

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
    if (!invoicesData || invoicesData.length === 0) {
      toast.error("Không có dữ liệu để xuất");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(
      invoicesData.map((item, index) => ({
        "#": index + 1,
        "Mã hóa đơn": item.id || "",
        "Tên bệnh nhân": item.patient || "",
        "Dịch vụ": item.service || "",
        "Tổng tiền": item.total || "",
        "Ngày tạo": item.date || "",
        "Trạng thái": item.status || "",
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Invoices");

    const excelFile = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    const file = new Blob([s2ab(excelFile)], {
      type: "application/octet-stream",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = "invoices.xlsx";
    link.click();
  };

  return (
    <Layout>
      {/* nút thêm hóa đơn */}
      <Link
        to="/invoices/create"
        className="w-16 animate-bounce h-16 border border-border z-50 bg-subMain text-white rounded-full flex-colo fixed bottom-8 right-12 button-fb"
      >
        <BiPlus className="text-2xl" />
      </Link>

      {/* tiêu đề */}
      <h1 className="text-xl font-semibold">Hóa Đơn</h1>
      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="100"
        data-aos-offset="200"
        className="bg-white my-8 rounded-xl border-[1px] border-border p-5"
      >
        {/* dữ liệu */}
        <div className="grid md:grid-cols-6 sm:grid-cols-2 grid-cols-1 gap-2">
          <div className="md:col-span-5 grid lg:grid-cols-4 items-center gap-6">
            <input
              type="text"
              placeholder='Tìm kiếm "tên bệnh nhân"'
              className="h-14 w-full text-sm text-main rounded-md bg-dry border border-border px-4"
            />
          </div>

          {/* xuất dữ liệu */}
          <Button
            label="Xuất File"
            Icon={MdOutlineCloudDownload}
            onClick={handleExport}
          />
        </div>

        <div className="mt-8 w-full overflow-x-scroll">
          <InvoiceTable data={data} />
        </div>
      </div>
    </Layout>
  );
}

export default Invoices;

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
import Paginate from "../../utils/pagination.js";

function Invoices() {
  const { data, loading, error, pagination } = useSelector((state) => state.invoice);
  const dispatch = useDispatch();

  // 🔸 Tìm kiếm, lọc ngày, sắp xếp
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("newest");
  const [dateFilter, setDateFilter] = React.useState({ from: "", to: "" });
  const [filteredData, setFilteredData] = React.useState([]);

  // 🔸 Phân trang
  const [page, setPage] = React.useState(1);
  const limit = 10;

  useEffect(() => {
    dispatch(fetchInvoice({ page, limit }));
  }, [dispatch, page]);

  useEffect(() => {
    let temp = [...data];

    if (searchTerm.trim()) {
      temp = temp.filter((item) => {
        const profile = item.bookingId?.profileId;
        const fullName = `${profile?.firstName || ""} ${profile?.lastName || ""}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      });
    }

    if (dateFilter.from) {
      const fromDate = new Date(dateFilter.from);
      temp = temp.filter((item) => new Date(item.createdAt) >= fromDate);
    }

    if (dateFilter.to) {
      const toDate = new Date(dateFilter.to);
      temp = temp.filter((item) => new Date(item.createdAt) <= toDate);
    }

    temp.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredData(temp);
  }, [data, searchTerm, dateFilter, sortOrder]);


  if (loading) return <Loading />;

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

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
      <h1 className="text-xl font-semibold">Invoices</h1>
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

          {/* xuất dữ liệu */}
          <Button
            label="Xuất File"
            Icon={MdOutlineCloudDownload}
            onClick={handleExport}
          />
        </div>

        <div className="mt-8 w-full overflow-x-scroll">
          <InvoiceTable data={filteredData} page={page} limit={limit}/>
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

export default Invoices;

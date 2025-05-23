import React, { useEffect, useState } from "react";
import Layout from "../../Layout";
import { toast } from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { MdOutlineCloudDownload } from "react-icons/md";
import { AiOutlinePrinter } from "react-icons/ai";
import PaymentModal from "../../components/Modals/PaymentModal";
import { RiShareBoxLine } from "react-icons/ri";
import ShareModal from "../../components/Modals/ShareModal";
import SenderReceverComp from "../../components/SenderReceverComp";
import { format } from "date-fns";
import axios from "../../api/axios";
import Loading from "../../components/Loading";
import ErrorFallback from "../../components/ErrorFallback";

function PreviewInvoice() {
  const { _id } = useParams();
  const [isOpen, setIsoOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchInvoice = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/invoices/get-detail/${_id}`);
      setInvoice(res.data);
    } catch (error) {
      setError(error);
      toast.error("Không thể tải hóa đơn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [_id]);

  if(loading) 
    return <Loading />
  
  if(error)
    return <ErrorFallback error={error} onRetry={fetchInvoice()} />

  const buttonClass =
    "bg-subMain flex-rows gap-3 bg-opacity-5 text-subMain rounded-lg border border-subMain border-dashed px-4 py-3 text-sm";

  if (loading || !invoice) return <p>Đang tải...</p>;

  const profile = invoice.bookingId?.profileId;
  const booking = invoice.bookingId;

  return (
    <Layout>
      {isOpen && <PaymentModal isOpen={isOpen} closeModal={() => setIsoOpen(false)} />}
      {isShareOpen && <ShareModal isOpen={isShareOpen} closeModal={() => setIsShareOpen(false)} />}

      <div className="flex-btn flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link to="/invoices" className="bg-white border border-subMain border-dashed rounded-lg py-3 px-4 text-md">
            <IoArrowBackOutline />
          </Link>
          <h1 className="text-xl font-semibold">Xem Trước Hóa Đơn</h1>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button onClick={() => setIsShareOpen(true)} className={buttonClass}>
            Chia Sẻ <RiShareBoxLine />
          </button>
          <button onClick={() => toast.error("Chức năng chưa khả dụng")} className={buttonClass}>
            Tải Xuống <MdOutlineCloudDownload />
          </button>
          <button onClick={() => toast.error("Chức năng chưa khả dụng")} className={buttonClass}>
            In <AiOutlinePrinter />
          </button>
          <Link to={`/invoices/edit/${invoice._id}`} className={buttonClass}>
            Chỉnh Sửa <FiEdit />
          </Link>
          <button onClick={() => setIsoOpen(true)} className="bg-subMain text-white rounded-lg px-6 py-3 text-sm">
            Tạo Thanh Toán
          </button>
        </div>
      </div>

      <div className="bg-white my-8 rounded-xl border-[1px] border-border p-5">
        {/* Tiêu đề */}
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-2 items-center">
          <div className="lg:col-span-3">
            <img src="/images/logo1.png" alt="logo" className=" w-32 object-contain" />
          </div>
          <div className="flex flex-col gap-4 sm:items-end">
            <h6 className="text-xs font-medium">#{invoice.invoiceId}</h6>
            <div className="flex gap-4">
              <p className="text-sm font-extralight">Ngày Tạo:</p>
              <h6 className="text-xs font-medium">{format(new Date(invoice.createdAt), "dd/MM/yyyy")}</h6>
            </div>
            <div className="flex gap-4">
              <p className="text-sm font-extralight">Hạn Thanh Toán:</p>
              <h6 className="text-xs font-medium">{format(new Date(invoice.dueDate), "dd/MM/yyyy")}</h6>
            </div>
          </div>
        </div>

        {/* Người gửi và nhận */}
        <SenderReceverComp
          item={{
            name: profile?.lastName + " " + profile?.firstName,
            address: profile?.address,
            // phone: profile?.phone,
            email: "", // nếu có
            participants: booking?.participants?.map(
              (p) => `${p.fullName}`
            ).join(", "),
          }}
          functions={{}}
          button={false}
        />


        {/* Thông tin dịch vụ */}
        <div className="grid grid-cols-6 gap-6 mt-8">
          <div className="lg:col-span-4 col-span-6 p-6 border border-border rounded-xl overflow-hidden">
            <h1 className="text-md font-semibold mb-4">Thông Tin Dịch Vụ</h1>
            <div className="flex flex-col gap-3 text-sm">
              <p><strong>Dịch vụ:</strong> {booking?.serviceId?.name || "Chưa có dịch vụ"}</p>
              <p><strong>Mô tả:</strong> {booking?.serviceId?.description || "Không có mô tả"}</p>
              <p><strong>Thời gian:</strong> {booking?.timeSlot?.start} - {booking?.timeSlot?.end}</p>
            </div>
          </div>
          <div className="col-span-6 lg:col-span-2 flex flex-col gap-6">
            <div className="flex-btn gap-4">
              <p className="text-sm font-extralight">Phương thức:</p>
              <h6 className="text-sm font-medium">{invoice.paymentMethod}</h6>
            </div>
            <div className="flex-btn gap-4">
              <p className="text-sm font-extralight">Tổng Thanh Toán:</p>
              <h6 className="text-sm font-medium text-green-600">
                {invoice.totalAmount.toLocaleString()} VNĐ
              </h6>
            </div>
            <div className="w-full p-4 border border-border rounded-lg">
              <h1 className="text-sm font-medium">Ghi Chú</h1>
              <p className="text-xs mt-2 font-light leading-5">
                Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default PreviewInvoice;

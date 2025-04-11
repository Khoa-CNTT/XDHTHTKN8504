import React, { useState } from "react";
import Layout from "../../Layout";
import { invoicesData } from "../../components/Datas";
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
import { InvoiceProductsTable } from "../../components/Tables";

function PreviewInvoice() {
  const { id } = useParams();
  const [isOpen, setIsoOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const buttonClass =
    "bg-subMain flex-rows gap-3 bg-opacity-5 text-subMain rounded-lg border border-subMain border-dashed px-4 py-3 text-sm";

  const invoice = invoicesData.find((invoice) => invoice.id.toString() === id);

  return (
    <Layout>
      {isOpen && (
        <PaymentModal
          isOpen={isOpen}
          closeModal={() => {
            setIsoOpen(false);
          }}
        />
      )}
      {isShareOpen && (
        <ShareModal
          isOpen={isShareOpen}
          closeModal={() => {
            setIsShareOpen(false);
          }}
        />
      )}
      <div className="flex-btn flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/invoices"
            className="bg-white border border-subMain border-dashed rounded-lg py-3 px-4 text-md"
          >
            <IoArrowBackOutline />
          </Link>
          <h1 className="text-xl font-semibold">Xem Trước Hóa Đơn</h1>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {/* nút chia sẻ */}
          <button
            onClick={() => {
              setIsShareOpen(true);
            }}
            className={buttonClass}
          >
            Chia Sẻ <RiShareBoxLine />
          </button>
          <button
            onClick={() => {
              toast.error("Chức năng này hiện chưa khả dụng");
            }}
            className={buttonClass}
          >
            Tải Xuống <MdOutlineCloudDownload />
          </button>
          <button
            onClick={() => {
              toast.error("Chức năng này hiện chưa khả dụng");
            }}
            className={buttonClass}
          >
            In <AiOutlinePrinter />
          </button>
          <Link to={`/invoices/edit/` + invoice?.id} className={buttonClass}>
            Chỉnh Sửa <FiEdit />
          </Link>
          <button
            onClick={() => {
              setIsoOpen(true);
            }}
            className="bg-subMain text-white rounded-lg px-6 py-3 text-sm"
          >
            Tạo Thanh Toán
          </button>
        </div>
      </div>
      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="100"
        data-aos-offset="200"
        className="bg-white my-8 rounded-xl border-[1px] border-border p-5"
      >
        {/* tiêu đề */}
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-2 items-center">
          <div className="lg:col-span-3">
            <img
              src="/images/logo1.png"
              alt="logo"
              className=" w-32 object-contain"
            />
          </div>

          <div className="flex flex-col gap-4 sm:items-end">
            <h6 className="text-xs font-medium">#{invoice?.id}</h6>

            <div className="flex gap-4">
              <p className="text-sm font-extralight">Ngày Tạo:</p>
              <h6 className="text-xs font-medium">{invoice?.createdDate}</h6>
            </div>
            <div className="flex gap-4">
              <p className="text-sm font-extralight">Hạn Thanh Toán:</p>
              <h6 className="text-xs font-medium">{invoice?.dueDate}</h6>
            </div>
          </div>
        </div>
        {/* người gửi và nhận */}
        <SenderReceverComp item={invoice.to} functions={{}} button={false} />
        {/* sản phẩm */}
        <div className="grid grid-cols-6 gap-6 mt-8">
          <div className="lg:col-span-4 col-span-6 p-6 border border-border rounded-xl overflow-hidden">
            <InvoiceProductsTable
              data={invoice?.items}
              functions={{}}
              button={false}
            />
          </div>
          <div className="col-span-6 lg:col-span-2 flex flex-col gap-6">
            <div className="flex-btn gap-4">
              <p className="text-sm font-extralight">Tiền Tệ:</p>
              <h6 className="text-sm font-medium">USD ($)</h6>
            </div>
            <div className="flex-btn gap-4">
              <p className="text-sm font-extralight">Tổng Cộng:</p>
              <h6 className="text-sm font-medium">$459</h6>
            </div>
            <div className="flex-btn gap-4">
              <p className="text-sm font-extralight">Giảm Giá:</p>
              <h6 className="text-sm font-medium">$49</h6>
            </div>
            <div className="flex-btn gap-4">
              <p className="text-sm font-extralight">Thuế:</p>
              <h6 className="text-sm font-medium">$4.90</h6>
            </div>
            <div className="flex-btn gap-4">
              <p className="text-sm font-extralight">Tổng Thanh Toán:</p>
              <h6 className="text-sm font-medium text-green-600">$6000</h6>
            </div>
            {/* ghi chú */}
            <div className="w-full p-4 border border-border rounded-lg">
              <h1 className="text-sm font-medium">Ghi Chú</h1>
              <p className="text-xs mt-2 font-light leading-5">
                Cảm ơn bạn đã hợp tác với chúng tôi. Chúng tôi hy vọng được tiếp
                tục hợp tác cùng bạn trong tương lai. Bạn có thể thanh toán hóa
                đơn trực tuyến tại www.example.com/payments
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default PreviewInvoice;

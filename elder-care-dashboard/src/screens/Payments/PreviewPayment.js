import React, { useState } from "react";
import Layout from "../../Layout";
import { toast } from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import { invoicesData, transactionData } from "../../components/Datas";
import ShareModal from "../../components/Modals/ShareModal";
import { RiShareBoxLine } from "react-icons/ri";
import { MdOutlineCloudDownload } from "react-icons/md";
import { AiOutlinePrinter } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { InvoiceProductsTable } from "../../components/Tables";
import SenderReceverComp from "../../components/SenderReceverComp";

function PreviewPayment() {
  const { id } = useParams();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const payment = transactionData.find((item) => item.id.toString() === id);
  const buttonClass =
    "bg-subMain flex-rows gap-3 bg-opacity-5 text-subMain rounded-lg border border-subMain border-dashed px-4 py-3 text-sm";

  return (
    <Layout>
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
            to="/payments"
            className="bg-white border border-subMain border-dashed rounded-lg py-3 px-4 text-md"
          >
            <IoArrowBackOutline />
          </Link>
          <h1 className="text-xl font-semibold">Xem Trước Thanh Toán</h1>
        </div>
        <div className="flex flex-wrap items-center gap-4">
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
              toast.error("Chức năng này chưa được hỗ trợ");
            }}
            className={buttonClass}
          >
            Tải Xuống <MdOutlineCloudDownload />
          </button>
          <button
            onClick={() => {
              toast.error("Chức năng này chưa được hỗ trợ");
            }}
            className={buttonClass}
          >
            In Hóa Đơn <AiOutlinePrinter />
          </button>
          <Link to={`/payments/edit/` + payment?.id} className={buttonClass}>
            Chỉnh Sửa <FiEdit />
          </Link>
        </div>
      </div>
      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="100"
        data-aos-offset="200"
        className="bg-white my-8 rounded-xl border-[1px] border-border p-5"
      >
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-2 items-center">
          <div className="lg:col-span-3 flex items-center gap-2">
            <img
              src="/images/logo1.png"
              alt="logo"
              className=" w-32 object-contain"
            />
            <span
              className={`text-xs px-4
              ${payment?.status === "Paid"
                  ? "bg-subMain text-subMain border-subMain"
                  : payment?.status === "Pending"
                    ? "bg-orange-500 text-orange-500 border-orange-500"
                    : payment?.status === "Cancel" &&
                    "bg-red-600 text-red-600 border-red-600"
                }
               py-1 border bg-opacity-10 border-opacity-40 rounded-full`}
            >
              {payment?.status === "Paid"
                ? "Đã Thanh Toán"
                : payment?.status === "Pending"
                  ? "Đang Chờ"
                  : payment?.status === "Cancel" && "Hủy"}
            </span>
          </div>

          <div className="flex flex-col gap-4 sm:items-end">
            <h6 className="text-xs font-medium">#78291</h6>
            <div className="flex gap-4">
              <p className="text-sm font-extralight">Ngày Tạo:</p>
              <h6 className="text-xs font-medium">12/4/2023</h6>
            </div>
            <div className="flex gap-4">
              <p className="text-sm font-extralight">Ngày Đáo Hạn:</p>
              <h6 className="text-xs font-medium">15/4/2023</h6>
            </div>
          </div>
        </div>
        <SenderReceverComp item={payment?.user} functions={{}} button={false} />
        <div className="grid grid-cols-6 gap-6 mt-8 items-start">
          <div className="lg:col-span-4 col-span-6">
            <div className="p-6 border border-border rounded-xl overflow-x-scroll">
              <InvoiceProductsTable
                data={invoicesData[2]?.items}
                functions={{}}
                button={false}
              />
            </div>
          </div>
          <div className="lg:col-span-2 col-span-6 flex flex-col gap-6">
            <div className="flex-btn gap-4">
              <p className="text-sm font-extralight">Thanh Toán Bởi:</p>
              <h6 className="text-sm font-medium">NHCF</h6>
            </div>
            <div className="flex-btn gap-4">
              <p className="text-sm font-extralight">Loại Tiền:</p>
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
            <div className="w-full p-4 border border-border rounded-lg">
              <h1 className="text-sm font-medium">Ghi Chú</h1>
              <p className="text-xs mt-2 font-light leading-5">
                Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi. Hy vọng được
                hợp tác cùng bạn trong tương lai. Bạn có thể thanh toán trực
                tuyến tại www.example.com/payments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default PreviewPayment;

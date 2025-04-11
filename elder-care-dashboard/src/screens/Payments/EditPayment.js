import React, { useState } from "react";
import Layout from "../../Layout";
import { toast } from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import { Button, Select, Textarea } from "../../components/Form";
import { BsSend } from "react-icons/bs";
import {
  invoicesData,
  sortsDatas,
  transactionData,
} from "../../components/Datas";
import { BiChevronDown } from "react-icons/bi";
import SenderReceverComp from "../../components/SenderReceverComp";
import { InvoiceProductsTable } from "../../components/Tables";

function EditPayment() {
  const { id } = useParams();
  const [selected, setSelected] = useState(sortsDatas.status[1]);
  const payment = transactionData.find((item) => item.id.toString() === id);

  return (
    <Layout>
      <div className="flex items-center gap-4">
        <Link
          to="/payments"
          className="bg-white border border-subMain border-dashed rounded-lg py-3 px-4 text-md"
        >
          <IoArrowBackOutline />
        </Link>
        <h1 className="text-xl font-semibold">Chỉnh Sửa Thanh Toán</h1>
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
          <div className="lg:col-span-3 flex items-center gap-2">
            <img
              src="/images/logo1.png"
              alt="logo"
              className=" w-32 object-contain"
            />
            <span
              className={`text-xs px-4
              ${
                payment.status === "Paid"
                  ? "bg-subMain text-subMain border-subMain"
                  : payment.status === "Pending"
                  ? "bg-orange-500 text-orange-500 border-orange-500"
                  : payment.status === "Cancel" &&
                    "bg-red-600 text-red-600 border-red-600"
              }
               py-1 border bg-opacity-10 border-opacity-40 rounded-full`}
            >
              {payment.status}
            </span>
          </div>

          <div className="flex flex-col gap-4 sm:items-end">
            <h6 className="text-xs font-medium">#78291</h6>
            <div className="flex gap-4">
              <p className="text-sm font-extralight">Ngày:</p>
              <h6 className="text-xs font-medium">12/4/2023</h6>
            </div>
            <div className="flex gap-4">
              <p className="text-sm font-extralight">Hạn Chót:</p>
              <h6 className="text-xs font-medium">15/4/2023</h6>
            </div>
          </div>
        </div>
        {/* người gửi và nhận */}
        <SenderReceverComp item={payment.user} functions={{}} button={false} />
        {/* sản phẩm */}
        <div className="grid grid-cols-6 gap-6 mt-8 items-start">
          <div className="lg:col-span-4 col-span-6">
            <div className="p-6 border border-border rounded-xl w-full overflow-x-scroll">
              <InvoiceProductsTable
                data={invoicesData[2]?.items}
                functions={{}}
                button={false}
              />
            </div>
            {/* ghi chú */}
            <div className="w-full my-8">
              <p className="text-sm mb-3">Thay Đổi Trạng Thái</p>
              <Select
                selectedPerson={selected}
                setSelectedPerson={setSelected}
                datas={sortsDatas?.status}
              >
                <div className="h-14 w-full text-xs text-main rounded-md border border-border px-4 flex items-center justify-between">
                  <p>{selected?.name}</p>
                  <BiChevronDown className="text-xl" />
                </div>
              </Select>
            </div>
            <Textarea
              label="Ghi Chú"
              placeholder="Cảm ơn bạn đã giao dịch với chúng tôi. Hy vọng được hợp tác lần sau!"
              color={true}
              rows={3}
            />
          </div>
          <div className="lg:col-span-2 col-span-6 flex flex-col gap-6">
            <div className="flex-btn gap-4">
              <p className="text-sm font-extralight">Thanh Toán Bởi:</p>
              <h6 className="text-sm font-medium">NHCF</h6>
            </div>
            <div className="flex-btn gap-4">
              <p className="text-sm font-extralight">Loại Tiền Tệ:</p>
              <h6 className="text-sm font-medium">USD ($)</h6>
            </div>
            <div className="flex-btn gap-4">
              <p className="text-sm font-extralight">Tổng Phụ:</p>
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
              <p className="text-sm font-extralight">Tổng Cộng:</p>
              <h6 className="text-sm font-medium text-green-600">$6000</h6>
            </div>

            <Button
              label="Cập Nhật"
              onClick={() => {
                toast.error("Tính năng này chưa khả dụng");
              }}
              Icon={BsSend}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default EditPayment;

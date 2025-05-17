import React, { useEffect } from "react";
import { Button } from "../../components/Form";
import { BiPlus } from "react-icons/bi";
import { FiEye } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { RiDeleteBin6Line } from "react-icons/ri";
import { medicalRecodData } from "../../components/Datas";
import MedicalRecodModal from "../../components/Modals/MedicalRecodModal";
import { useNavigate, useParams } from "react-router-dom";
import { fetchTransactions } from "../../store/walletSlice";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";

function MedicalRecord() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [datas, setDatas] = React.useState({});
  const navigate = useNavigate();
  const { _id } = useParams();
  const dispatch = useDispatch();
  const { transactions, loading, error } = useSelector((state) => state.wallet)

  useEffect(() => {
    dispatch(fetchTransactions(_id))
  }, [dispatch, _id])

  // console.log("transactions", transactions);

  return (
    <>
      {
        // Modal
        isOpen && (
          <MedicalRecodModal
            closeModal={() => {
              setIsOpen(false);
              setDatas({});
            }}
            isOpen={isOpen}
            datas={datas}
          />
        )
      }
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Tổng tiền lương */}
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-gray-500 text-sm">Tiền còn lại</p>
            <p className="text-xl font-semibold text-green-600"></p>
          </div>

          {/* Tổng đơn thanh toán */}
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-gray-500 text-sm">Số giao dịch đã thực hiện</p>
            <p className="text-xl font-semibold text-blue-600"> đơn</p>
          </div>

          {/* Tổng đơn đang đợi */}
          {/* <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-gray-500 text-sm">Tổng đơn đang đợi</p>
            <p className="text-xl font-semibold text-yellow-600"> đơn</p>
          </div> */}
        </div>
        <div className="flex-btn gap-4">
          <h1 className="text-sm font-medium sm:block hidden">
            Transaction History
          </h1>
          {/* <div className="sm:w-1/4 w-full">
            <Button
              label="New Record"
              Icon={BiPlus}
              onClick={() => {
                navigate(`/customers/visiting/2`);
              }}
            />
          </div> */}
        </div>
        {transactions.map((data) => {
          const transactionDate = data?.date
            ? format(new Date(data.date), "MMM dd, yyyy")
            : "Null";
          return (
            <div
              key={data._id}
              className="bg-dry items-start grid grid-cols-12 gap-4 rounded-xl border-[1px] border-border p-6"
            >
              <div className="col-span-12 md:col-span-2">
                <p className="text-xs text-textGray font-medium">{transactionDate}</p>
              </div>
              <div className="col-span-12 md:col-span-6 flex flex-col gap-2">
                {/* {data?.data?.map((item, index) => (
                <p key={item.id} className="text-xs text-main font-light">
                  <span className="font-medium">{item?.title}:</span>{" "}
                  {
                    // if value character is more than 40, show only 40 characters
                    item?.value?.length > 40
                      ? `${item?.value?.slice(0, 40)}...`
                      : item?.value
                  }
                </p>
              ))} */}
                <p className="text-xs text-main font-light">
                  <span className="font-medium">Mã giao dịch: </span>{data.transactionId} <br />
                  <span className="font-medium">Phương thức: </span>{data.type} <br />
                  <span className="font-medium">Trạng thái: </span>{data.status === 'success' && "Hoàn thành"}<br />
                  <span className="font-medium">Mô tả: </span>{data.description}
                </p>
              </div>
              {/* price */}
              <div className="col-span-12 md:col-span-2">
                <p className="text-xs text-subMain font-semibold">
                  <span className="font-light text-main">(Tsh)</span>{" "}
                  {data?.amount}
                </p>
              </div>
              {/* actions */}
              {/* <div className="col-span-12 md:col-span-2 flex-rows gap-2">
              <button
                onClick={() => {
                  setIsOpen(true);
                  setDatas(data);
                }}
                className="text-sm flex-colo bg-white text-subMain border border-border rounded-md w-2/4 md:w-10 h-10"
              >
                <FiEye />
              </button>
              <button
                onClick={() => {
                  toast.error("This feature is not available yet");
                }}
                className="text-sm flex-colo bg-white text-red-600 border border-border rounded-md w-2/4 md:w-10 h-10"
              >
                <RiDeleteBin6Line />
              </button>
            </div> */}
            </div>
          )
        })}
      </div>
    </>
  );
}

export default MedicalRecord;

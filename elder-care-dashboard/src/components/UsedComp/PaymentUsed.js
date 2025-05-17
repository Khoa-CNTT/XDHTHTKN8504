import { transactionData } from "../Datas";
import { PaymentTable } from "../Tables";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPaymentsByStaff, fetchSalaryByStaff } from "../../store/paymentSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import Loading from "../Loading";

function PaymentsUsed({ doctor }) {
  const navigate = useNavigate();
  const { _id } = useParams();
  const dispatch = useDispatch();
  const { data: payments, loading, error } = useSelector((state) => state.payment)
  const { salary } = useSelector((state) => state.payment)

  useEffect(() => {
    if (_id) {
      dispatch(fetchSalaryByStaff(_id));
      dispatch(fetchPaymentsByStaff(_id));
    }
  }, [dispatch, _id]);

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500">{error.message || error}</p>;

  // onClick event handler
  const handleEventClick = (_id) => {
    navigate(`/payments/preview/${_id}`);
  };

  // console.log("salary", salary);
  // console.log("fff", payments);

  const totalSalary = salary?.totalSalary
    ? `${salary.totalSalary.toLocaleString("vi-vn")} VND`
    : "0";

  return (
    <div className="w-full">
      {/* Three summary boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Tổng tiền lương */}
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <p className="text-gray-500 text-sm">Tổng tiền lương</p>
          <p className="text-xl font-semibold text-green-600">{totalSalary}</p>
        </div>

        {/* Tổng đơn thanh toán */}
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <p className="text-gray-500 text-sm">Tổng đơn thanh toán</p>
          <p className="text-xl font-semibold text-blue-600">{salary?.successCount} đơn</p>
        </div>

        {/* Tổng đơn đang đợi */}
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <p className="text-gray-500 text-sm">Tổng đơn đang đợi</p>
          <p className="text-xl font-semibold text-yellow-600">{salary?.pendingCount} đơn</p>
        </div>
      </div>

      {/* Payment section */}
      <h1 className="text-sm font-medium mb-6">Payments</h1>
      <div className="w-full overflow-x-scroll">
        <PaymentTable
          data={payments}
          doctor={doctor}
          functions={{
            preview: handleEventClick,
          }}
        />
      </div>
    </div>
  );
}

export default PaymentsUsed;

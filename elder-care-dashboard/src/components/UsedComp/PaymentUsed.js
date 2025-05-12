import { transactionData } from "../Datas";
import { PaymentTable } from "../Tables";
import { useNavigate } from "react-router-dom";

function PaymentsUsed({ doctor }) {
  const navigate = useNavigate();
  // onClick event handler
  const handleEventClick = (id) => {
    navigate(`/payments/preview/${id}`);
  };
  return (
    <div className="w-full">
      {/* Three summary boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Tổng tiền lương */}
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <p className="text-gray-500 text-sm">Tổng tiền lương</p>
          <p className="text-xl font-semibold text-green-600">120.000.000₫</p>
        </div>

        {/* Tổng đơn thanh toán */}
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <p className="text-gray-500 text-sm">Tổng đơn thanh toán</p>
          <p className="text-xl font-semibold text-blue-600">32 đơn</p>
        </div>

        {/* Tổng đơn đang đợi */}
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <p className="text-gray-500 text-sm">Tổng đơn đang đợi</p>
          <p className="text-xl font-semibold text-yellow-600">5 đơn</p>
        </div>
      </div>

      {/* Payment section */}
      <h1 className="text-sm font-medium mb-6">Payments</h1>
      <div className="w-full overflow-x-scroll">
        <PaymentTable
          data={transactionData}
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

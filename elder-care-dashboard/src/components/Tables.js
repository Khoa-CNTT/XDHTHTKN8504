import React from "react";
import { MenuSelect } from "./Form";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { FiEdit, FiEye } from "react-icons/fi";
import { RiDeleteBin6Line, RiDeleteBinLine } from "react-icons/ri";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const thclass = "text-start text-sm font-medium py-3 px-2 whitespace-nowrap";
const tdclass = "text-start text-sm py-4 px-2 whitespace-nowrap";

export function Transactiontable({ data, action, functions }) {
  const DropDown1 = [
    {
      title: "Chỉnh sửa",
      icon: FiEdit,
      onClick: (data) => {
        functions.edit(data.id);
      },
    },
    {
      title: "Xem",
      icon: FiEye,
      onClick: (data) => {
        functions.preview(data.id);
      },
    },
    {
      title: "Xóa",
      icon: RiDeleteBin6Line,
      onClick: () => {
        toast.error("Tính năng này chưa khả dụng");
      },
    },
  ];
  return (
    <table className="table-auto w-full">
      <thead className="bg-dry rounded-md overflow-hidden">
        <tr>
          <th className={thclass}>#</th>
          <th className={thclass}>Khách hàng</th>
          <th className={thclass}>Ngày</th>
          <th className={thclass}>Trạng thái</th>
          <th className={thclass}>
            Số tiền <span className="text-xs font-light">(VND)</span>
          </th>
          <th className={thclass}>Phương thức</th>
          {action && <th className={thclass}>Thao tác</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr
            key={item.id}
            className="border-b border-border hover:bg-greyed transitions"
          >
            <td className={tdclass}>{index + 1}</td>
            <td className={tdclass}>
              <div className="flex gap-4 items-center">
                <span className="w-12">
                  <img
                    src={item.user.image}
                    alt={item.user.title}
                    className="w-full h-12 rounded-full object-cover border border-border"
                  />
                </span>

                <div>
                  <h4 className="text-sm font-medium">{item.user.title}</h4>
                  <p className="text-xs mt-1 text-textGray">
                    {item.user.phone}
                  </p>
                </div>
              </div>
            </td>
            <td className={tdclass}>{item.date}</td>
            <td className={tdclass}>
              <span
                className={`py-1 px-4 ${item.status === "Paid"
                  ? "bg-subMain text-subMain"
                  : item.status === "Pending"
                    ? "bg-orange-500 text-orange-500"
                    : item.status === "Cancel" && "bg-red-600 text-red-600"
                  } bg-opacity-10 text-xs rounded-xl`}
              >
                {item.status === "Paid"
                  ? "Đã thanh toán"
                  : item.status === "Pending"
                    ? "Đang chờ xử lý"
                    : item.status === "Cancel" && "Đã hủy"}
              </span>
            </td>
            <td className={`${tdclass} font-semibold`}>{item.amount}</td>
            <td className={tdclass}>{item.method}</td>
            {action && (
              <td className={tdclass}>
                <MenuSelect datas={DropDown1} item={item}>
                  <div className="bg-dry border text-main text-xl py-2 px-4 rounded-lg">
                    <BiDotsHorizontalRounded />
                  </div>
                </MenuSelect>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// invoice table
export function InvoiceTable({ data }) {
  const navigate = useNavigate();
  const DropDown1 = [
    {
      title: "Chỉnh sửa",
      icon: FiEdit,
      onClick: (item) => {
        navigate(`/invoices/edit/${item.id}`);
      },
    },
    {
      title: "Xem",
      icon: FiEye,
      onClick: (item) => {
        navigate(`/invoices/preview/${item.id}`);
      },
    },
    {
      title: "Xóa",
      icon: RiDeleteBin6Line,
      onClick: () => {
        toast.error("Tính năng này chưa khả dụng");
      },
    },
  ];
  return (
    <table className="table-auto w-full">
      <thead className="bg-dry rounded-md overflow-hidden">
        <tr>
          <th className={thclass}>Mã hóa đơn</th>
          <th className={thclass}>khách hàng</th>
          <th className={thclass}>Ngày tạo</th>
          <th className={thclass}>Ngày đến hạn</th>
          <th className={thclass}>
            Số tiền <span className="text-xs font-light">(VND)</span>
          </th>
          <th className={thclass}>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr
            key={item.id}
            className="border-b border-border hover:bg-greyed transitions"
          >
            <td className={tdclass}>#{item?.id}</td>
            <td className={tdclass}>
              <div className="flex gap-4 items-center">
                <span className="w-12">
                  <img
                    src={item?.to?.image}
                    alt={item?.to?.title}
                    className="w-full h-12 rounded-full object-cover border border-border"
                  />
                </span>
                <div>
                  <h4 className="text-sm font-medium">{item?.to?.title}</h4>
                  <p className="text-xs mt-1 text-textGray">
                    {item?.to?.email}
                  </p>
                </div>
              </div>
            </td>
            <td className={tdclass}>{item?.createdDate}</td>
            <td className={tdclass}>{item?.dueDate}</td>
            <td className={`${tdclass} font-semibold`}>{item?.total}</td>
            <td className={tdclass}>
              <MenuSelect datas={DropDown1} item={item}>
                <div className="bg-dry border text-main text-xl py-2 px-4 rounded-lg">
                  <BiDotsHorizontalRounded />
                </div>
              </MenuSelect>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// prescription table

export function MedicineTable({ data, onEdit }) {
  const DropDown1 = [
    {
      title: "Chỉnh sửa",
      icon: FiEdit,
      onClick: (item) => {
        onEdit(item);
      },
    },
    {
      title: "Xóa",
      icon: RiDeleteBin6Line,
      onClick: () => {
        toast.error("Tính năng này chưa được hỗ trợ");
      },
    },
  ];
  return (
    <table className="table-auto w-full">
      <thead className="bg-dry rounded-md overflow-hidden">
        <tr>
          <th className={thclass}>Tên thuốc</th>
          <th className={thclass}>
            Giá <span className="text-xs font-light">(Tsh)</span>
          </th>
          <th className={thclass}>Trạng thái</th>
          <th className={thclass}>Còn hàng</th>
          <th className={thclass}>Đơn vị đo lường</th>
          <th className={thclass}>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr
            key={item.id}
            className="border-b border-border hover:bg-greyed transitions"
          >
            <td className={tdclass}>
              <h4 className="text-sm font-medium">{item?.name}</h4>
            </td>
            <td className={`${tdclass} font-semibold`}>{item?.price}</td>
            <td className={tdclass}>
              <span
                className={`text-xs font-medium ${item?.status === "Out of stock"
                  ? "text-red-600"
                  : "text-green-600"
                  }`}
              >
                {item?.status === "Out of stock" ? "Hết hàng" : "Còn hàng"}
              </span>
            </td>
            <td className={tdclass}>{item?.stock}</td>
            <td className={tdclass}>{item?.measure}</td>
            <td className={tdclass}>
              <MenuSelect datas={DropDown1} item={item}>
                <div className="bg-dry border text-main text-xl py-2 px-4 rounded-lg">
                  <BiDotsHorizontalRounded />
                </div>
              </MenuSelect>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ServiceTable
export function ServiceTable({ data, onEdit }) {
  const DropDown1 = [
    {
      title: "Chỉnh sửa",
      icon: FiEdit,
      onClick: (item) => {
        onEdit(item);
      },
    },
    {
      title: "Xóa",
      icon: RiDeleteBin6Line,
      onClick: () => {
        toast.error("Tính năng này chưa được hỗ trợ");
      },
    },
  ];
  return (
    <table className="table-auto w-full">
      <thead className="bg-dry rounded-md overflow-hidden">
        <tr>
          <th className={thclass}>Tên dịch vụ</th>
          <th className={thclass}>Ngày tạo</th>
          <th className={thclass}>
            Giá <span className="text-xs font-light">(Tsh)</span>
          </th>
          <th className={thclass}>Trạng thái</th>
          <th className={thclass}>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => {
          const serviceName = item?.name || "Không rõ";
          const serviceDate = new Date(item?.createdAt).toLocaleDateString("vi-VN");
          const servicePrice = item?.price || "Không rõ";
          let serviceStatus;
          if (item?.isActive === true) {
            serviceStatus = "Bật";
          } else if (item?.isActive === false) {
            serviceStatus = "Tắt";
          }

          return (
            <tr
              key={item._id}
              className="border-b border-border hover:bg-greyed transitions"
            >
              <td className={tdclass}>
                <h4 className="text-sm font-medium">{serviceName}</h4>
              </td>
              <td className={tdclass}>{serviceDate}</td>
              <td className={`${tdclass} font-semibold`}>{servicePrice}</td>
              <td className={tdclass}>
                <span
                  className={`text-xs font-medium ${!serviceStatus ? "text-red-600" : "text-green-600"
                    }`}
                >
                  {serviceStatus}
                </span>
              </td>
              <td className={tdclass}>
                <MenuSelect datas={DropDown1} item={item}>
                  <div className="bg-dry border text-main text-xl py-2 px-4 rounded-lg">
                    <BiDotsHorizontalRounded />
                  </div>
                </MenuSelect>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// patient table
export function PatientTable({ data, functions, used }) {
  const DropDown1 = !used
    ? [
      {
        title: "Xem",
        icon: FiEye,
        onClick: (data) => {
          functions.preview(data.id);
        },
      },
      {
        title: "Xóa",
        icon: RiDeleteBin6Line,
        onClick: () => {
          toast.error("Tính năng này chưa được hỗ trợ");
        },
      },
    ]
    : [
      {
        title: "Xem",
        icon: FiEye,
        onClick: (data) => {
          functions.preview(data.id);
        },
      },
    ];
  const thclasse = "text-start text-sm font-medium py-3 px-2 whitespace-nowrap";
  const tdclasse = "text-start text-xs py-4 px-2 whitespace-nowrap";


  return (
    <table className="table-auto w-full">
      <thead className="bg-dry rounded-md overflow-hidden">
        <tr>
          <th className={thclasse}>#</th>
          <th className={thclasse}>khách hàng</th>
          <th className={thclasse}>Ngày Tạo</th>
          <th className={thclasse}>Giới Tính</th>
          {!used && (
            <>
              <th className={thclasse}>Nhóm Máu</th>
              <th className={thclasse}>Tuổi</th>
            </>
          )}

          <th className={thclasse}>Hành Động</th>
        </tr>
      </thead>
      <tbody>
        {data?.map((item, index) => {
          let firstName = "Không rõ";
          let lastName;
        
          if (item.profiles && item.profiles.length > 0) {
            firstName = item.profiles[0].firstName || "Không rõ";
            lastName = item.profiles[0].lastName || "Không rõ";
          }
          
          const phoneNumber = item.phone || "Không rõ";
          const createdDate = new Date(item.createdAt).toLocaleDateString("vi-VN") || "Không rõ";
          const gender = 'Male';
          const bloodType = "Không rõ";
          const age = "Không rõ";


          return (
            <tr
              key={item.id}
              className="border-b border-border hover:bg-greyed transitions"
            >
              <td className={tdclasse}>{index + 1}</td>
              <td className={tdclasse}>
                <div className="flex gap-4 items-center">
                  {/* {!used && (
                    <span className="w-12">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-12 rounded-full object-cover border border-border"
                      />
                    </span>
                  )} */}

                  <div>
                    <h4 className="text-sm font-medium">{firstName} {lastName}</h4>
                    <p className="text-xs mt-1 text-textGray">{phoneNumber}</p>
                  </div>
                </div>
              </td>
              <td className={tdclasse}>{createdDate}</td>

              <td className={tdclasse}>
                <span
                  className={`py-1 px-4 ${gender === "Male"
                    ? "bg-subMain text-subMain"
                    : "bg-orange-500 text-orange-500"
                    } bg-opacity-10 text-xs rounded-xl`}
                >
                  {gender === "Male" ? "Nam" : "Nữ"}
                </span>
              </td>
              {!used && (
                <>
                  <td className={tdclasse}>{bloodType}</td>
                  <td className={tdclasse}>{age}</td>
                </>
              )}

              <td className={tdclasse}>
                <MenuSelect datas={DropDown1} item={item}>
                  <div className="bg-dry border text-main text-xl py-2 px-4 rounded-lg">
                    <BiDotsHorizontalRounded />
                  </div>
                </MenuSelect>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// doctor table
export function DoctorsTable({ data, functions, doctor }) {
  const DropDown1 = [
    {
      title: "Xem",
      icon: FiEye,
      onClick: (data) => {
        functions.preview(data);
      },
    },
    {
      title: "Xóa",
      icon: RiDeleteBin6Line,
      onClick: () => {
        toast.error("Tính năng này chưa được hỗ trợ");
      },
    },
  ];
  return (
    <table className="table-auto w-full">
      <thead className="bg-dry rounded-md overflow-hidden">
        <tr>
          <th className={thclass}>#</th>
          <th className={thclass}>Họ và tên</th>
          <th className={thclass}>Ngày Tạo</th>
          <th className={thclass}>Điện Thoại</th>
          <th className={thclass}>Chức Danh</th>
          <th className={thclass}>Email</th>
          <th className={thclass}>Xem lương</th>
          <th className={thclass}>Hành Động</th>
        </tr>
      </thead>
      <tbody>


        {data.map((item, index) => {
          const fullName = `${item.firstName} ${item.lastName}`;
          const createdDate = new Date(item.createdAt).toLocaleDateString("vi-VN");
          const phone = item.userId.phone || "Không rõ";
          let title;
          if (item.type === "doctor") {
            title = "Bác sĩ"
          } else if (item.type === "nurse") {
            title = "Điều dưỡng"
          }
          const email = item.email || "Không rõ";


          return (
            <tr
              key={item.id}
              className="border-b border-border hover:bg-greyed transitions"
            >
              <td className={tdclass}>{index + 1}</td>
              <td className={tdclass}>
                <div className="flex gap-4 items-center">
                  {/* <span className="w-12">
                    <img
                      src={item.user.image}
                      alt={item.user.title}
                      className="w-full h-12 rounded-full object-cover border border-border"
                    />
                  </span> */}
                  <h4 className="text-sm font-medium">{fullName}</h4>

                </div>
              </td>
              <td className={tdclass}>{createdDate}</td>
              <td className={tdclass}>
                <p className="text-textGray">{phone}</p>
              </td>
              <td className={tdclass}>{title}</td>
              <td className={tdclass}>{email}</td>
              <td className={tdclass}>
                <Link
                  to={`/nurses/payroll/${data.id}`}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Xem lương
                </Link>
              </td>
              <td className={tdclass}>
                <MenuSelect datas={DropDown1} item={item}>
                  <div className="bg-dry border text-main text-xl py-2 px-4 rounded-lg">
                    <BiDotsHorizontalRounded />
                  </div>
                </MenuSelect>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
export function BookingTable({ data, functions, doctor }) {
  const statusMap = {
    pending: "Chưa nhận",
    accepted: "Đã được nhận",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
  };
  const DropDown1 = [
    {
      title: "Xem",
      icon: FiEye,
      onClick: (data) => {
        functions.preview(data);
      },
    },
    {
      title: "Xóa",
      icon: RiDeleteBin6Line,
      onClick: () => {
        toast.error("Tính năng này chưa được hỗ trợ");
      },
    },
  ];
  return (
    <table className="table-auto w-full">
      <thead className="bg-dry rounded-md overflow-hidden">
        <tr>
          <th className={thclass}>#</th>
          {/* <th className={thclass}>{doctor ? "Điều dưỡng" : "Y Tá"}</th> */}
          <th className={thclass}>Khách hàng</th>
          <th className={thclass}>Người thực hiện</th>
          <th className={thclass}>Ngày bắt đầu</th>
          <th className={thclass}>Ngày kết thúc</th>
          <th className={thclass}>Dịch vụ</th>
          <th className={thclass}>Trạng thái</th>
          <th className={thclass}>Hành Động</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => {
          const userFullName = `${item?.profileId?.firstName || "Ẩn"} ${item?.profileId?.lastName || ""}`;
          const staffFullName = item?.participants?.[0]?.fullName || "Chưa có";
          const serviceName = item?.serviceId?.name || "Không rõ";
          const startDate = new Date(item?.repeatFrom).toLocaleDateString("vi-VN");
          const endDate = new Date(item?.repeatTo).toLocaleDateString("vi-VN");
          const statusText = statusMap[item.status] || "Không xác định";

          return (
            <tr
              key={item._id}
              className="border-b border-border hover:bg-greyed transitions"
            >
              <td className={tdclass}>{index + 1}</td>

              <td className={tdclass}>
                <div className="flex gap-4 items-center">
                  {/* <span className="w-12">
                    <img
                      src={"https://via.placeholder.com/150"} // Hoặc lấy từ profile nếu có
                      alt={userFullName}
                      className="w-full h-12 rounded-full object-cover border border-border"
                    />
                  </span> */}
                  <h4 className="text-sm font-medium">{userFullName}</h4>
                </div>
              </td>

              <td className={tdclass}>{staffFullName}</td>

              <td className={tdclass}>{startDate}</td>
              <td className={tdclass}>{endDate}</td>
              <td className={tdclass}>{serviceName}</td>

              <td className={tdclass}>
                <span className="py-1 px-4 bg-subMain text-subMain bg-opacity-10 text-xs rounded-xl">
                  {statusText}
                </span>
              </td>

              <td className={tdclass}>
                <MenuSelect datas={DropDown1} item={item}>
                  <div className="bg-dry border text-main text-xl py-2 px-4 rounded-lg">
                    <BiDotsHorizontalRounded />
                  </div>
                </MenuSelect>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// appointment table
export function AppointmentTable({ data, functions, doctor }) {
  return (
    <table className="table-auto w-full">
      <thead className="bg-dry rounded-md overflow-hidden">
        <tr>
          <th className={thclass}>Ngày</th>
          <th className={thclass}>{doctor ? "khách hàng" : "Điều dưỡng"}</th>
          <th className={thclass}>Trạng thái</th>
          <th className={thclass}>Thời gian</th>

          <th className={thclass}>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr
            key={item.id}
            className="border-b border-border hover:bg-greyed transitions"
          >
            <td className={tdclass}>
              <p className="text-xs">{item.date}</p>
            </td>
            <td className={tdclass}>
              <h4 className="text-xs font-medium">
                {doctor ? item.user.title : item.doctor.title}
              </h4>
              <p className="text-xs mt-1 text-textGray">
                {doctor ? item.user.phone : item.doctor.phone}
              </p>
            </td>
            <td className={tdclass}>
              <span
                className={`py-1 px-4 ${item.status === "Approved"
                  ? "bg-subMain text-subMain"
                  : item.status === "Pending"
                    ? "bg-orange-500 text-orange-500"
                    : item.status === "Cancel" && "bg-red-600 text-red-600"
                  } bg-opacity-10 text-xs rounded-xl`}
              >
                {item.status === "Approved"
                  ? "Đã chấp thuận"
                  : item.status === "Pending"
                    ? "Đang chờ xử lý"
                    : "Đã hủy"}
              </span>
            </td>

            <td className={tdclass}>
              <p className="text-xs">{`${item.from} - ${item.to}`}</p>
            </td>
            <td className={tdclass}>
              <button
                onClick={() => functions.preview(item)}
                className="text-sm flex-colo bg-white text-subMain border rounded-md w-10 h-10"
              >
                <FiEye />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// payment table
export function PaymentTable({ data, functions, doctor }) {
  return (
    <table className="table-auto w-full">
      <thead className="bg-dry rounded-md overflow-hidden">
        <tr>
          <th className={thclass}>Ngày</th>
          <th className={thclass}>{doctor ? "khách hàng" : "Điều dưỡng"}</th>
          <th className={thclass}>Trạng thái</th>
          <th className={thclass}>Số tiền</th>
          <th className={thclass}>Phương thức</th>
          <th className={thclass}>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr
            key={item.id}
            className="border-b border-border hover:bg-greyed transitions"
          >
            <td className={tdclass}>
              <p className="text-xs">{item.date}</p>
            </td>
            <td className={tdclass}>
              <h4 className="text-xs font-medium">
                {doctor ? item.user.title : item.doctor.title}
              </h4>
              <p className="text-xs mt-1 text-textGray">
                {doctor ? item.user.phone : item.doctor.phone}
              </p>
            </td>
            <td className={tdclass}>
              <span
                className={`py-1 px-4 ${item.status === "Paid"
                  ? "bg-subMain text-subMain"
                  : item.status === "Pending"
                    ? "bg-orange-500 text-orange-500"
                    : item.status === "Cancel" && "bg-red-600 text-red-600"
                  } bg-opacity-10 text-xs rounded-xl`}
              >
                {item.status === "Paid"
                  ? "Đã thanh toán"
                  : item.status === "Pending"
                    ? "Đang chờ xử lý"
                    : "Đã hủy"}
              </span>
            </td>
            <td className={tdclass}>
              <p className="text-xs font-semibold">{`$${item.amount}`}</p>
            </td>
            <td className={tdclass}>
              <p className="text-xs">
                {item.method === "CreditCard" ? "Thẻ tín dụng" : item.method}
              </p>
            </td>
            <td className={tdclass}>
              <button
                onClick={() => functions.preview(item.id)}
                className="text-sm flex-colo bg-white text-subMain border rounded-md w-10 h-10"
              >
                <FiEye />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// invoice used table
export function InvoiceUsedTable({ data, functions }) {
  return (
    <table className="table-auto w-full">
      <thead className="bg-dry rounded-md overflow-hidden">
        <tr>
          <th className={thclass}>Mã Hóa Đơn</th>
          <th className={thclass}>Ngày Tạo</th>
          <th className={thclass}>Ngày Đến Hạn</th>
          <th className={thclass}>Số Tiền</th>
          <th className={thclass}>Hành Động</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr
            key={item.id}
            className="border-b border-border hover:bg-greyed transitions"
          >
            <td className={tdclass}>
              <p className="text-xs">#{item.id}</p>
            </td>
            <td className={tdclass}>
              <p className="text-xs">{item.createdDate}</p>
            </td>
            <td className={tdclass}>
              <p className="text-xs">{item.dueDate}</p>
            </td>

            <td className={tdclass}>
              <p className="text-xs font-semibold">{`$${item.total}`}</p>
            </td>

            <td className={tdclass}>
              <button
                onClick={() => functions.preview(item.id)}
                className="text-sm flex-colo bg-white text-subMain border rounded-md w-10 h-10"
              >
                <FiEye />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Invoice Products Table
export function InvoiceProductsTable({ data, functions, button }) {
  return (
    <table className="table-auto w-full">
      <thead className="bg-dry rounded-md overflow-hidden">
        <tr>
          <th className={thclass}>Món Hàng</th>
          <th className={thclass}>
            Giá Món Hàng
            <span className="text-xs font-light ml-1">(Tsh)</span>
          </th>
          <th className={thclass}>Số Lượng</th>
          <th className={thclass}>
            Thành Tiền
            <span className="text-xs font-light ml-1">(Tsh)</span>
          </th>
          {button && <th className={thclass}>Hành Động</th>}
        </tr>
      </thead>
      <tbody>
        {data?.map((item) => (
          <tr
            key={item.id}
            className="border-b border-border hover:bg-greyed transitions"
          >
            <td className={`${tdclass} font-medium`}>{item.name}</td>
            <td className={`${tdclass} text-xs`}>{item.price}</td>
            <td className={tdclass}>{item.id}</td>
            <td className={tdclass}>{item.price * item.id}</td>
            {button && (
              <td className={tdclass}>
                <button
                  onClick={() => functions.deleteItem(item.id)}
                  className="bg-red-600 bg-opacity-5 text-red-600 rounded-lg border border-red-100 py-3 px-4 text-sm"
                >
                  <RiDeleteBinLine />
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Medicine Dosage Table
export function MedicineDosageTable({ data, functions, button }) {
  const thclasse = "text-start text-xs font-medium py-3 px-2 whitespace-nowrap";
  const tdclasse = "text-start text-xs py-4 px-2 whitespace-nowrap";
  return (
    <table className="table-auto w-full">
      <thead className="bg-dry rounded-md overflow-hidden">
        <tr>
          <th className={thclasse}>Món Hàng</th>
          <th className={thclasse}>
            Giá Món Hàng
            <span className="text-xs font-light ml-1">(Tsh)</span>
          </th>
          <th className={thclasse}>Liều Dùng</th>
          <th className={thclasse}>Hướng Dẫn</th>
          <th className={thclasse}>Số Lượng</th>
          <th className={thclasse}>
            Thành Tiền
            <span className="text-xs font-light ml-1">(Tsh)</span>
          </th>
          {button && <th className={thclasse}>Hành Động</th>}
        </tr>
      </thead>
      <tbody>
        {data?.map((item) => (
          <tr
            key={item.id}
            className="border-b border-border hover:bg-greyed transitions"
          >
            <td className={tdclasse}>{item.name}</td>
            <td className={tdclasse}>{item.price}</td>
            <td className={tdclasse}>{item.id} - Sáng/Trưa/Tối</td>
            <td className={tdclasse}>{item.instraction}</td>
            <td className={tdclasse}>{item.id}</td>
            <td className={tdclasse}>{item.price * item.id}</td>
            {button && (
              <td className={tdclasse}>
                <button
                  onClick={() => functions.delete(item.id)}
                  className="bg-red-600 bg-opacity-5 text-red-600 rounded-lg border border-red-100 py-3 px-4 text-sm"
                >
                  <RiDeleteBinLine />
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

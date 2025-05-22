import React from "react";
import { MenuSelect } from "./Form";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { FiEdit, FiEye, FiTrash2 } from "react-icons/fi";
import { RiDeleteBin6Line, RiDeleteBinLine } from "react-icons/ri";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
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
        {data.map((item, index) => {
          const avatarUrl =
            item?.bookingId?.profileId?.avartar ||
            "https://scontent.fdad8-2.fna.fbcdn.net/v/t39.30808-1/453072859_908668704639042_7014970388308944883_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=1&ccb=1-7&_nc_sid=2d3e12&_nc_eui2=AeEg-UXOgqW74CRH95x_vpPfMDEPn7GasIkwMQ-fsZqwiaTDML4C_AjQ9G4mJk502SC6mNYg1kbsI6j2IjDb_RqB&_nc_ohc=os7jBcSY43wQ7kNvwFjnh4Z&_nc_oc=AdmzOOO8hZeJeXo0q0qz7Va4_lzOA7GZ8JwgNLDqq9AjAPkTV2N3ZPRpOGeR_CKP8Iw&_nc_zt=24&_nc_ht=scontent.fdad8-2.fna&_nc_gid=jxjl2Qe12i52CPcsacSiZA&oh=00_AfLDvAifihod_-c9AU2sgSGv7R_zcmF30poydHRK92I_4w&oe=682D29C9";
          const fullName =
            `${item?.bookingId?.profileId?.firstName} ${item?.bookingId?.profileId?.lastName}` ||
            "N/A";
          const phone = item.bookingId?.profileId?.phone || "N/A";
          const formattedDate = item.createdAt
            ? format(new Date(item.createdAt), "MMM dd, yyyy")
            : "Null";
          const status = item.status;
          const totalAmount = item.amount
            ? `${item.amount.toLocaleString("vi")} VND`
            : "Null";

          return (
            <tr
              key={item._id}
              className="border-b border-border hover:bg-greyed transitions"
            >
              <td className={tdclass}>{index + 1}</td>
              <td className={tdclass}>
                <div className="flex gap-4 items-center">
                  <span className="w-12">
                    <img
                      src={avatarUrl}
                      alt={avatarUrl}
                      className="w-full h-12 rounded-full object-cover border border-border"
                    />
                  </span>

                  <div>
                    <h4 className="text-sm font-medium">{fullName}</h4>
                    <p className="text-xs mt-1 text-textGray">{phone}</p>
                  </div>
                </div>
              </td>
              <td className={tdclass}>{formattedDate}</td>
              <td className={tdclass}>
                <span
                  className={`py-1 px-4 ${
                    status === "success"
                      ? "bg-subMain text-subMain"
                      : status === "pending"
                      ? "bg-orange-500 text-orange-500"
                      : status === "fail" && "bg-red-600 text-red-600"
                  } bg-opacity-10 text-xs rounded-xl`}
                >
                  {status === "success"
                    ? "Đã thanh toán"
                    : status === "pending"
                    ? "Đang chờ xử lý"
                    : status === "fail" && "Đã hủy"}
                </span>
              </td>
              <td className={`${tdclass} font-semibold`}>{totalAmount}</td>
              <td className={tdclass}>
                {item.method === "Wallet" ? "Ví điện tử" : item.method}
              </td>
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
          );
        })}
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
        {data.map((item) => {
          const invoiceCode = item?.invoiceId;
          const avatarUrl = item?.bookingId?.profileId?.avartar;
          const firstName = item?.bookingId?.profileId?.firstName;
          const lastName = item?.bookingId?.profileId?.lastName;
          const phone = item?.bookingId?.profileId?.phone;
          const createdDate = new Date(item?.createdAt).toLocaleDateString('vi-VN');
          const dueDate = new Date(item?.dueDate).toLocaleDateString('vi-VN');
          const totalAmount = item?.totalAmount.toLocaleString("vi");

          return (
            <tr
              key={item._id}
              className="border-b border-border hover:bg-greyed transitions"
            >
              <td className={tdclass}>#{invoiceCode}</td>
              <td className={tdclass}>
                <div className="flex gap-4 items-center">
                  <span className="w-12">
                    <img
                      src={avatarUrl}
                      alt={lastName}
                      className="w-full h-12 rounded-full object-cover border border-border"
                    />
                  </span>
                  <div>
                    <h4 className="text-sm font-medium">{firstName} {lastName}</h4>
                    <p className="text-xs mt-1 text-textGray">
                      {phone}
                    </p>
                  </div>
                </div>
              </td>
              <td className={tdclass}>{createdDate}</td>
              <td className={tdclass}>{dueDate}</td>
              <td className={`${tdclass} font-semibold`}>{totalAmount}</td>
              <td className={tdclass}>
                <MenuSelect datas={DropDown1} item={item}>
                  <div className="bg-dry border text-main text-xl py-2 px-4 rounded-lg z-50">
                    <BiDotsHorizontalRounded />
                  </div>
                </MenuSelect>
              </td>
            </tr>
          )
        })}
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
                className={`text-xs font-medium ${
                  item?.status === "Out of stock"
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
export function ServiceTable({ data, onEdit, onDelete }) {
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
        {data.map((item) => {
          const serviceName = item?.name || "Không rõ";
          const serviceDate = item?.createdAt
            ? new Date(item.createdAt).toLocaleDateString("vi-VN")
            : "Không rõ";
          const servicePrice = item.price
            ? `${item.price.toLocaleString("vi")} VND`
            : "Null";
          const isActive = item?.isActive;
          const serviceStatus = isActive === true ? "Đã duyệt" : "Chưa duyệt";
          const statusColor =
            isActive === true ? "text-green-600" : "text-red-600";
          const imageUrl = item?.imgUrl || "https://placehold.co/400";

          return (
            <tr
              key={item._id}
              className="border-b border-border hover:bg-greyed transitions"
            >
              <td className={tdclass}>
                <div className="flex gap-4 items-center">
                  <span className="w-12">
                    <img
                      src={imageUrl}
                      alt={serviceName}
                      className="w-full h-12 rounded-full object-cover border border-border"
                    />
                  </span>
                  <h4 className="text-sm font-medium">{serviceName}</h4>
                </div>
              </td>
              <td className={tdclass}>{serviceDate}</td>
              <td className={`${tdclass} font-semibold`}>{servicePrice}</td>
              <td className={tdclass}>
                <span className={`text-xs font-medium ${statusColor}`}>
                  {serviceStatus}
                </span>
              </td>
              <td className={tdclass}>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md text-sm hover:bg-blue-200 transition"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => onDelete(item._id)}
                    className="px-3 py-1 bg-red-100 text-red-600 rounded-md text-sm hover:bg-red-200 transition"
                  >
                    Xoá
                  </button>
                </div>
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
          const createdDate =
            new Date(item.createdAt).toLocaleDateString("vi-VN") || "Không rõ";
          const gender = item?.profiles[0]?.sex === "Male" ? "Nam" : "Nữ";
          const bloodType = item?.profiles[0]?.healthInfo[0]?.typeBlood;
          // const bloodType = "";


          function calculateAge(birthDateString) {
            const today = new Date();
            const birthDate = new Date(birthDateString);

            let age = today.getFullYear() - birthDate.getFullYear();

            // Kiểm tra nếu chưa đến sinh nhật trong năm nay thì trừ đi 1
            const monthDiff = today.getMonth() - birthDate.getMonth();
            const dayDiff = today.getDate() - birthDate.getDate();

            if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
              age--;
            }

            return age;
          }

          const age = calculateAge(item?.profiles[0]?.birthDate);
          const avatarUrl =
            item?.profiles[0]?.avartar || "https://via.placeholder.com/150";

          return (
            <tr
              key={item._id}
              className="border-b border-border hover:bg-greyed transitions"
            >
              <td className={tdclasse}>{index + 1}</td>
              <td className={tdclasse}>
                <div className="flex gap-4 items-center">
                  {!used && (
                    <span className="w-12">
                      <img
                        src={avatarUrl}
                        alt={lastName}
                        className="w-full h-12 rounded-full object-cover border border-border"
                      />
                    </span>
                  )}

                  <div>
                    <h4 className="text-sm font-medium">
                      {firstName} {lastName}
                    </h4>
                    <p className="text-xs mt-1 text-textGray">{phoneNumber}</p>
                  </div>
                </div>
              </td>
              <td className={tdclasse}>{createdDate}</td>

              <td className={tdclasse}>
                <span
                  className={`py-1 px-4 ${
                    gender === "Male"
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

              <td className={`${tdclasse} flex gap-2`}>
                <button
                  onClick={() => functions.preview(item._id)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <FiEye />
                  Xem
                </button>
                {!used && (
                  <button
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Bạn có chắc chắn muốn xóa khách hàng này không này không?"
                        )
                      ) {
                        functions.onDelete(item._id);
                      }
                    }}
                  >
                    <FiTrash2 />
                    Xóa
                  </button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// doctor table
export function DoctorsTable({ data, functions, doctor, onEdit }) {
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
          const createdDate = new Date(item.createdAt).toLocaleDateString(
            "vi-VN"
          );
          const phone = item.userId?.phone || "Không rõ";

          let title = "";
          if (item.type === "doctor") title = "Bác sĩ";
          else if (item.type === "nurse") title = "Điều dưỡng";

          const email = item.email || "Không rõ";
          const avatarUrl =
            item.userId?.avatar || "https://via.placeholder.com/150";

          return (
            <tr
              key={item._id}
              className="border-b border-border hover:bg-greyed transitions"
            >
              <td className={tdclass}>{index + 1}</td>
              <td className={tdclass}>
                <div className="flex gap-4 items-center">
                  <span className="w-12">
                    <img
                      src={avatarUrl}
                      alt={fullName}
                      className="w-full h-12 rounded-full object-cover border border-border"
                    />
                  </span>
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
                  to={`/staffs/preview/${item._id}?tab=4`}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Xem lương
                </Link>
              </td>
              <td className={tdclass}>
                <div className="flex gap-2">
                  <button
                    onClick={() => functions.preview(item._id)}
                    className="text-green-600 hover:text-green-800 flex items-center gap-1"
                  >
                    <FiEye /> Xem
                  </button>
                  <button
                    onClick={() => onEdit(item)}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <FiEdit /> Sửa
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Bạn có chắc chắn muốn xóa nhân viên này không?"
                        )
                      ) {
                        functions.onDelete(item._id);
                      }
                    }}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    <RiDeleteBin6Line /> Xóa
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
export function BookingTable({ data, functions, doctor, page = 1, limit = 10 }) {
  const statusMap = {
    pending: "Chưa nhận",
    paid: "Đã thanh toán",
    accepted: "Đã được nhận",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
  };

  const startIndex = (page - 1) * limit;

  return (
    <table className="table-auto w-full">
      <thead className="bg-dry rounded-md overflow-hidden">
        <tr>
          <th className={thclass}>#</th>
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
          const userFullName = `${item?.profileId?.firstName || "Ẩn"} ${
            item?.profileId?.lastName || ""
          }`;
          const staffFullName = item?.participants?.[0]?.fullName || "Chưa có";
          const serviceName = item?.serviceId?.name || "Không rõ";
          const startDate = new Date(item?.repeatFrom).toLocaleDateString(
            "vi-VN"
          );
          const endDate = new Date(item?.repeatTo).toLocaleDateString("vi-VN");
          const statusText = statusMap[item.status] || "Không xác định";
          const avatarUrl = item?.profileId?.avartar;

          return (
            <tr
              key={item._id}
              className="border-b border-border hover:bg-greyed transitions"
            >
              <td className={tdclass}>{startIndex + index + 1}</td>

              <td className={tdclass}>
                <div className="flex gap-4 items-center">
                  <span className="w-12">
                    <img
                      src={avatarUrl}
                      alt={avatarUrl}
                      className="w-full h-12 rounded-full object-cover border border-border"
                    />
                  </span>
                  <h4 className="text-sm font-medium">{userFullName}</h4>
                </div>
              </td>

              <td className={tdclass}>{staffFullName}</td>

              <td className={tdclass}>{startDate}</td>
              <td className={tdclass}>{endDate}</td>
              <td className={tdclass}>{serviceName}</td>

              <td className={tdclass}>
                <span
                  className={`py-1 px-4 ${
                    item.status === "completed"
                      ? "bg-green-500 text-green-500"
                      : item.status === "accepted"
                      ? "bg-orange-500 text-orange-500"
                      : item.status === "pending"
                      ? "bg-red-600 text-red-600"
                      : item.status === "paid"
                      ? "bg-green-500 text-green-500"
                      : item.status === "cancelled" &&
                        "bg-gray-500 text-gray-500"
                  } bg-opacity-10 text-xs rounded-xl`}
                >
                  {statusText}
                </span>
              </td>

              <td className={tdclass}>
                <button
                  onClick={() => functions.preview(item._id)}
                  className="text-green-600 hover:text-green-800 flex items-center gap-1"
                >
                  <FiEye /> Xem
                </button>
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
          <th className={thclass}>Khách hàng</th>
          <th className={thclass}>Trạng thái</th>
          <th className={thclass}>Thời gian</th>
          <th className={thclass}>Dịch vụ</th>
          <th className={thclass}>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => {
          const scheduleDate = item?.date
            ? format(new Date(item.date), "MMM dd, yyyy")
            : "Null";
          const patientName = item?.patientName || "Không xác định";
          const formatTimeRange = (start, end) => {
            const to12Hour = (dateStr) => {
              const date = new Date(dateStr);
              date.setHours(date.getHours() - 7);
              let hours = date.getHours();
              const minutes = date.getMinutes();
              const ampm = hours >= 12 ? "PM" : "AM";
              hours = hours % 12 || 12;
              const pad = (n) => n.toString().padStart(2, "0");
              return `${pad(hours)}:${pad(minutes)} ${ampm}`;
            };
            return `${to12Hour(start)} - ${to12Hour(end)}`;
          };

          const timeRange =
            item.timeSlots && item.timeSlots.length > 0
              ? formatTimeRange(item.timeSlots[0].start, item.timeSlots[0].end)
              : "Không xác định";
          const serviceName = item?.serviceName;

          return (
            <tr
              key={item.id}
              className="border-b border-border hover:bg-greyed transitions"
            >
              <td className={tdclass}>
                <p className="text-xs">{scheduleDate}</p>
              </td>
              <td className={tdclass}>
                <h4 className="text-xs font-medium">{patientName}</h4>
                {/* <p className="text-xs mt-1 text-textGray">
                  {doctor ? item.user.phone : item.doctor.phone}
                </p> */}
              </td>
              <td className={tdclass}>
                <span
                  className={`py-1 px-4 ${
                    item.status === "scheduled"
                      ? "bg-subMain text-subMain"
                      : item.status === "waiting_for_nurse"
                      ? "bg-orange-500 text-orange-500"
                      : item.status === "waiting_for_client"
                      ? "bg-subMain text-subMain"
                      : item.status === "on_the_way"
                      ? "bg-subMain text-subMain"
                      : item.status === "check_in"
                      ? "bg-subMain text-subMain"
                      : item.status === "in_progress"
                      ? "bg-subMain text-subMain"
                      : item.status === "check_out"
                      ? "bg-subMain text-subMain"
                      : item.status === "completed"
                      ? "bg-subMain text-subMain"
                      : item.status === "canceled" && "bg-red-600 text-red-600"
                  } bg-opacity-10 text-xs rounded-xl`}
                >
                  {item.status === "scheduled"
                    ? "Đã chấp nhận"
                    : item.status === "waiting_for_nurse"
                    ? "Đang chờ nhân viên"
                    : item.status === "waiting_for_client"
                    ? "Chờ khách hàng"
                    : item.status === "on_the_way"
                    ? "Trên đường tới"
                    : item.status === "check_in"
                    ? "Đã đến"
                    : item.status === "in_progress"
                    ? "Đang thực hiện"
                    : item.status === "check_out"
                    ? "Chờ xác nhận"
                    : item.status === "completed"
                    ? "Hoàn thành"
                    : "Đã hủy"}
                </span>
              </td>

              <td className={tdclass}>
                <p className="text-xs">{timeRange}</p>
              </td>
              <td className={tdclass}>
                <p
                  className="text-xs truncate max-w-[120px]"
                  title={serviceName}
                >
                  {serviceName}
                </p>
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
          );
        })}
      </tbody>
    </table>
  );
}
export function BookingTable1({ data = [], functions, doctor }) {
  const statusMap = {
    pending: "Chưa nhận",
    paid: "Đã thanh toán",
    accepted: "Đã được nhận",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
  };

  return (
    <table className="table-auto w-full">
      <thead className="bg-dry rounded-md overflow-hidden">
        <tr>
          <th className={thclass}>Ngày</th>
          <th className={thclass}>Tên dịch vụ</th>
          <th className={thclass}>Trạng thái</th>
          <th className={thclass}>Thời gian</th>

          <th className={thclass}>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => {
          const formattedDate = item.createdAt
            ? format(new Date(item.createdAt), "MMM dd, yyyy")
            : "Null";

          const serviceName = item?.serviceId?.name;
          const statusText = statusMap[item.status] || "Không xác định";
          const formatTimeRange = (start, end) => {
            const to12Hour = (timeStr) => {
              const [hours, minutes] = timeStr.split(":").map(Number);
              const date = new Date();
              date.setHours(hours);
              date.setMinutes(minutes);

              const hour12 = date.getHours() % 12 || 12;
              const ampm = date.getHours() >= 12 ? "PM" : "AM";
              const pad = (n) => n.toString().padStart(2, "0");

              return `${pad(hour12)}:${pad(date.getMinutes())} ${ampm}`;
            };

            return `${to12Hour(start)} - ${to12Hour(end)}`;
          };

          const timeRange =
            item.timeSlot && item.timeSlot.start && item.timeSlot.end
              ? formatTimeRange(item.timeSlot.start, item.timeSlot.end)
              : "Không xác định";

          return (
            <tr className="border-b border-border hover:bg-greyed transitions">
              <td className={tdclass}>
                <p className="text-xs">{formattedDate}</p>
              </td>
              <td className={tdclass}>
                <h4 className="text-xs font-medium truncate max-w-[120px]">
                  {serviceName}
                </h4>
                <p className="text-xs mt-1 text-textGray"></p>
              </td>
              <td className={tdclass}>
                <span
                  className={`py-1 px-4 ${
                    item.status === "completed"
                      ? "bg-green-500 text-green-500"
                      : item.status === "accepted"
                      ? "bg-orange-500 text-orange-500"
                      : item.status === "pending"
                      ? "bg-red-600 text-red-600"
                      : item.status === "paid"
                      ? "bg-green-500 text-green-500"
                      : item.status === "cancelled" &&
                        "bg-gray-500 text-gray-500"
                  } bg-opacity-10 text-xs rounded-xl`}
                >
                  {statusText}
                </span>
              </td>

              <td className={tdclass}>
                <p className="text-xs">{timeRange}</p>
              </td>
              <td className={tdclass}>
                <button
                  // onClick={() => functions.preview(item)}
                  className="text-sm flex-colo bg-white text-subMain border rounded-md w-10 h-10"
                >
                  <FiEye />
                </button>
              </td>
            </tr>
          );
        })}
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
        {data.map((item) => {
          const formattedDate = item.createdAt
            ? format(new Date(item.createdAt), "MMM dd, yyyy")
            : "Null";

          const customerName =
            `${item?.bookingId?.profileId?.firstName} ${item?.bookingId?.profileId?.lastName}` ||
            "N/A";

          const status = item.status;
          const phone = item.bookingId?.profileId?.phone || "N/A";
          const totalAmount = item.amount
            ? `${item.amount.toLocaleString("en-US")} VND`
            : "Null";

          return (
            <tr
              key={item._id}
              className="border-b border-border hover:bg-greyed transitions"
            >
              <td className={tdclass}>
                <p className="text-xs">{formattedDate}</p>
              </td>
              <td className={tdclass}>
                <h4 className="text-xs font-medium">{customerName}</h4>
                <p className="text-xs mt-1 text-textGray">{phone}</p>
              </td>
              <td className={tdclass}>
                <span
                  className={`py-1 px-4 ${
                    status === "success"
                      ? "bg-subMain text-subMain"
                      : status === "Pending"
                      ? "bg-orange-500 text-orange-500"
                      : status === "Cancel" && "bg-red-600 text-red-600"
                  } bg-opacity-10 text-xs rounded-xl`}
                >
                  {status === "success"
                    ? "Đã thanh toán"
                    : status === "Pending"
                    ? "Đang chờ xử lý"
                    : "Đã hủy"}
                </span>
              </td>
              <td className={tdclass}>
                <p className="text-xs font-semibold">{totalAmount}</p>
              </td>
              <td className={tdclass}>
                <p className="text-xs">
                  {item.method === "Wallet" ? "Ví điện tử" : item.method}
                </p>
              </td>
              <td className={tdclass}>
                <button
                  onClick={() => functions.preview(item._id)}
                  className="text-sm flex-colo bg-white text-subMain border rounded-md w-10 h-10"
                >
                  <FiEye />
                </button>
              </td>
            </tr>
          );
        })}
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

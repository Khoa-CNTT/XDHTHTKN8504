import { HiOutlineHome, HiOutlineMail, HiOutlineUsers } from "react-icons/hi";
import {
  TbCalendar,
  TbChartHistogram,
  TbFile,
  TbFileInvoice,
  TbLockAccess,
  TbUsers,
} from "react-icons/tb";
import { FaRegCalendarAlt, FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import {
  RiFileList3Line,
  RiHeartLine,
  RiImageLine,
  RiLockPasswordLine,
  RiMedicineBottleLine,
  RiMoneyDollarCircleLine,
  RiStethoscopeLine,
  RiUserHeartLine,
  RiUserLine,
} from "react-icons/ri";
import {
  MdListAlt,
  MdOutlineAttachMoney,
  MdOutlineCampaign,
  MdOutlineInventory2,
  MdOutlineTextsms,
  MdChat,
} from "react-icons/md";
import { AiOutlineSetting } from "react-icons/ai";
import { BiCalendar, BiUserPlus } from "react-icons/bi";

export const MenuDatas = [
  {
    title: "Dashboard",
    path: "/",
    icon: HiOutlineHome,
  },
  {
    title: "Customers",
    path: "/customers",
    icon: TbUsers,
  },
  {
    title: "Receptions",
    path: "/receptions",
    icon: HiOutlineUsers,
  },
  {
    title: "Nurse",
    path: "/nurses",
    icon: RiUserHeartLine,
  },

  {
    title: "Appointments",
    path: "/appointments",
    icon: FaRegCalendarAlt,
  },
  {
    title: "Payments",
    path: "/payments",
    icon: MdListAlt,
  },
  {
    title: "Invoices",
    path: "/invoices",
    icon: TbFileInvoice,
  },
  {
    title: "Services",
    path: "/services",
    icon: MdOutlineInventory2,
  },
  // {
  //   title: "Medicine",
  //   path: "/medicine",
  //   icon: RiMedicineBottleLine,
  // },
  // {
  //   title: "Campaigns",
  //   path: "/campaigns",
  //   icon: MdOutlineCampaign,
  // },
  {
    title: "Chat",
    path: "/chat",
    icon: MdChat,
  },

  {
    title: "Settings",
    path: "/settings",
    icon: AiOutlineSetting,
  },
];
export const memberData = [
  {
    id: 1,
    title: "Nguyễn Văn An",
    image: "/images/user1.png",
    admin: false,
    email: "nguyenvanan@gmail.com",
    phone: "+84 912 345 678",
    age: 25,
    gender: "Male",
    blood: "A+",
    totalAppointments: 5,
    date: "20 Aug 2021",
  },
  {
    id: 2,
    title: "Trần Thị Hoa",
    image: "/images/user2.png",
    admin: false,
    email: "tranthihoa@gmail.com",
    phone: "+84 934 567 890",
    age: 34,
    gender: "Female",
    blood: "B+",
    totalAppointments: 3,
    date: "22 Nov 2023",
  },
  {
    id: 3,
    title: "Phạm Minh Quân",
    image: "/images/user3.png",
    admin: false,
    phone: "+84 987 654 321",
    email: "phamminhquan@gmail.com",
    age: 45,
    gender: "Male",
    blood: "O+",
    totalAppointments: 26,
    date: "12 Jan 2020",
  },
  {
    id: 4,
    title: "Lê Thị Phương",
    image: "/images/user4.png",
    admin: true,
    phone: "+84 911 223 344",
    email: "lethiphuong@gmail.com",
    age: 28,
    gender: "Female",
    blood: "AB+",
    totalAppointments: 17,
    date: "07 Feb 2001",
  },
  {
    id: 5,
    title: "Đặng Quốc Bảo",
    image: "/images/user5.png",
    admin: false,
    phone: "+84 933 112 233",
    email: "dangquocbao@gmail.com",
    age: 35,
    gender: "Male",
    blood: "A+",
    totalAppointments: 9,
    date: "30 Dec 2019",
  },
  {
    id: 6,
    title: "Vũ Thanh Hương",
    image: "/images/user6.png",
    admin: false,
    phone: "+84 955 667 788",
    email: "vuthanhhuong@gmail.com",
    age: 29,
    gender: "Female",
    blood: "B+",
    totalAppointments: 34,
    date: "12 Jan 2020",
  },
  {
    id: 7,
    title: "Hoàng Đức Anh",
    image: "/images/user7.png",
    admin: false,
    phone: "+84 911 567 890",
    email: "hoangducanh@gmail.com",
    age: 32,
    gender: "Male",
    blood: "O-",
    totalAppointments: 12,
    date: "18 Mar 2023",
  },
  {
    id: 8,
    title: "Ngô Thị Lan",
    image: "/images/user8.png",
    admin: false,
    phone: "+84 988 445 556",
    email: "ngothilan@gmail.com",
    age: 27,
    gender: "Female",
    blood: "AB+",
    totalAppointments: 70,
    date: "01 June 2018",
  },
];

export const sortsDatas = {
  status: [
    {
      id: 1,
      name: "Status...",
    },
    {
      id: 2,
      name: "Pending",
    },
    {
      id: 3,
      name: "Approved",
    },
    {
      id: 4,
      name: "Cancelled",
    },
  ],
  method: [
    { id: 1, name: "Phương thức thanh toán" },
    { id: 2, name: "Tiền mặt" },
    { id: 3, name: "Bảo hiểm NHCF" },
    { id: 4, name: "Bảo hiểm Britam" },
  ],
  currency: [
    { id: 1, name: "Chọn loại tiền tệ" },
    { id: 2, name: "USD (Đô la Mỹ)" },
    { id: 3, name: "EUR (Euro)" },
    { id: 4, name: "VND (Việt Nam)" },
  ],
  instractions: [
    {
      id: 1,
      name: "Select Instraction",
    },
    {
      id: 2,
      name: "After Meal",
    },
    {
      id: 3,
      name: "Before Meal",
    },
  ],
  measure: [
    {
      id: 1,
      name: "Select Measure",
    },
    {
      id: 2,
      name: "mg",
    },
    {
      id: 3,
      name: "ml",
    },
    {
      id: 4,
      name: "gm",
    },
    {
      id: 5,
      name: "kg",
    },
    {
      id: 6,
      name: "lb",
    },
    {
      id: 7,
      name: "tbsp",
    },
    {
      id: 8,
      name: "tablet",
    },
    {
      id: 9,
      name: "capsule",
    },
  ],
  stocks: [
    {
      id: 1,
      name: "All",
    },
    {
      id: 2,
      name: "Available",
    },
    {
      id: 3,
      name: "Out of Stock",
    },
  ],
  service: [
    {
      id: 1,
      name: "All",
    },
    {
      id: 2,
      name: "Enabled",
    },
    {
      id: 3,
      name: "Disabled",
    },
  ],
  title: [
    {
      id: 1,
      name: "Dr.",
    },
    {
      id: 2,
      name: "Mr.",
    },
    {
      id: 3,
      name: "Mrs.",
    },
    {
      id: 4,
      name: "Ms.",
    },
  ],
  filterPatient: [
    {
      id: 1,
      name: "Sắp xếp theo...",
    },
    {
      id: 2,
      name: "Bệnh nhân mới nhất",
    },
    {
      id: 3,
      name: "Bệnh nhân cũ nhất",
    },
  ],
  genderFilter: [
    {
      id: 1,
      name: "Giới tính...",
    },
    {
      id: 2,
      name: "Nữ",
    },
    {
      id: 3,
      name: "Nam",
    },
  ],
  bloodTypeFilter: [
    {
      id: 1,
      name: "Blood Type...",
    },
    {
      id: 2,
      name: "A+",
    },
    {
      id: 3,
      name: "A-",
    },
    {
      id: 4,
      name: "B+",
    },
    {
      id: 5,
      name: "B-",
    },
    {
      id: 6,
      name: "AB+",
    },
    {
      id: 7,
      name: "AB-",
    },
    {
      id: 8,
      name: "O+",
    },
    {
      id: 9,
      name: "O-",
    },
  ],
  dosage: [
    {
      id: 1,
      name: "Buổi sáng (S)",
      value: "morning",
    },
    {
      id: 2,
      name: "Buổi chiều (C)",
      value: "afternoon",
    },
    {
      id: 3,
      name: "Buổi tối (T)",
      value: "evening",
    },
  ],
};

export const campaignData = [
  {
    id: 1,
    title: "Offer on Dental Checkup",
    date: "3 days ago",
    type: "email",
    sendTo: "All Customers",
    action: {
      subject: "Delight customers with a free dental checkup",
      message:
        "Dear Patient, We are delighted to offer you a free dental checkup. Please visit our clinic to avail this offer. Thank you. and have a nice day. and welcome to our clinic.",
      subHeader: "Offer on Dental Checkup",
      header: "How to avail this offer?",
      footer: "This offer is valid till 30th June, 2021",
    },
  },
  {
    id: 2,
    title: "Britam Insurance Offer",
    date: "8 days ago",
    type: "whatsapp",
    sendTo: "Britam Customers",
    action: {
      message:
        "Hellow Patient, are you looking for a free dental checkup? We are delighted to offer you a free dental checkup. Please visit our clinic to avail this offer. Thank you.",
    },
  },
  {
    id: 3,
    title: "NHCF Insurance Offer",
    date: "10 days ago",
    type: "sms",
    sendTo: "NHCF Customers",
    action: {
      message:
        "Hola, Delight patient with NHCF Insurance, We are delighted to offer you a free dental checkup. Please visit our clinic to avail this offer. Thank you.",
    },
  },
  {
    id: 4,
    title: "Cash customers offer",
    date: "15 days ago",
    type: "sms",
    sendTo: "Cash Customers",
    action: {
      message:
        "Delight Patient, now get 50% off on dental checkup. Please visit our clinic to avail this offer. Thank you. and have a nice day. and welcome to our clinic.",
    },
  },
  {
    id: 5,
    title: "Braces Offer",
    date: "12 days ago",
    type: "email",
    sendTo: "Britam Customers",
    action: {
      subject: "Delight customers with a free dental checkup",
      message:
        "Dear Patient, Britam Insurance is delighted to offer you a free dental checkup. Please visit our clinic to avail this offer. Thank you. and have a nice day. and welcome to our clinic.",
      subHeader: "Braces Offer for Britam Customers",
      header: "Now get braces at 50% off",
      footer: "This offer is valid till 30th June, 2021",
    },
  },
  {
    id: 6,
    title: "Teeth Whitening Offer",
    date: "20 days ago",
    type: "whatsapp",
    sendTo: "All Customers",
    action: {
      message:
        "Hola, Delight patient with Teeth Whitening Offer, We are delighted to offer you a free dental checkup. Please visit our clinic to avail this offer. Thank you.",
    },
  },
];
export const servicesData = [
  {
    id: 1,
    name: "Chọn dịch vụ chăm sóc...",
  },
  {
    id: 2,
    name: "Chăm sóc sức khỏe tổng quát tại nhà",
    price: 400000,
    date: "23 Tháng Sáu, 2021",
    status: true,
  },
  {
    id: 3,
    name: "Theo dõi huyết áp, đường huyết",
    price: 200000,
    date: "12 Tháng Một, 2022",
    status: true,
  },
  {
    id: 4,
    name: "Chăm sóc dinh dưỡng",
    price: 300000,
    date: "11 Tháng Tư, 2023",
    status: false,
  },
  {
    id: 5,
    name: "Chăm sóc vết thương, thay băng",
    price: 250000,
    date: "10 Tháng Tám, 2021",
    status: true,
  },
  {
    id: 6,
    name: "Vật lý trị liệu tại nhà",
    price: 500000,
    date: "23 Tháng Sáu, 2021",
    status: false,
  },
  {
    id: 7,
    name: "Tắm và vệ sinh cá nhân cho người cao tuổi",
    price: 180000,
    date: "09 Tháng Mười Hai, 2023",
    status: false,
  },
  {
    id: 8,
    name: "Hỗ trợ di chuyển, đi lại",
    price: 230000,
    date: "05 Tháng Hai, 2019",
    status: true,
  },
  {
    id: 9,
    name: "Massage giảm đau cơ và tuần hoàn máu",
    price: 300000,
    date: "16 Tháng Mười Một, 2022",
    status: true,
  },
  {
    id: 10,
    name: "Chăm sóc tâm lý, trò chuyện cùng người già",
    price: 150000,
    date: "02 Tháng Sáu, 2022",
    status: false,
  },
  {
    id: 11,
    name: "Tập vận động phục hồi chức năng",
    price: 400000,
    date: "23 Tháng Sáu, 2021",
    status: true,
  },
];

export const invoicesData = [
  {
    id: 206719,
    to: memberData[5],
    total: 6070,
    createdDate: "12/06/2021",
    dueDate: "16/06/2021",
    items: [
      {
        id: 1,
        name: servicesData[0].name,
        price: 500,
        description:
          "Root Canal Treatment with X-Ray and Consultation is included in this package",
      },
      {
        id: 2,
        name: servicesData[1].name,
        price: 300,
        description: "Teeth Whitening Treatment",
      },
      {
        id: 3,
        name: servicesData[2].name,
        price: 260,
        description: "Dental Implants Treatment",
      },
      {
        id: 4,
        name: servicesData[3].name,
        price: 190000,
        description: "Dental Crowns Treatment",
      },
      {
        id: 5,
        name: servicesData[4].name,
        price: 15000,
        description: "Dental Bridges Treatment",
      },
    ],
  },
  {
    id: 198772,
    to: memberData[6],
    total: 5000,
    createdDate: "10/02/2023",
    dueDate: "14/02/2023",
    items: [
      {
        id: 1,
        name: servicesData[3].name,
        price: 190000,
        description: "Dental Crowns Treatment",
      },
      {
        id: 2,
        name: servicesData[4].name,
        price: 15000,
        description: "Dental Bridges Treatment",
      },
      {
        id: 3,
        name: servicesData[8].name,
        price: 20000,
        description: "Dentures Treatment",
      },
      {
        id: 4,
        name: servicesData[3].name,
        price: 190000,
        description: "Dental Crowns Treatment",
      },
    ],
  },
  {
    id: 456789,
    to: memberData[7],
    total: 10000,
    createdDate: "09/01/2023",
    dueDate: "13/01/2023",
    items: [
      {
        id: 1,
        name: servicesData[5].name,
        price: 5000,
        description: "Dental Veneers Treatment",
      },
      {
        id: 2,
        name: servicesData[6].name,
        price: 16000,
        description: "Dental Braces Treatment",
      },
      {
        id: 3,
        name: servicesData[7].name,
        price: 10000,
        description: "Dental Sealants Treatment",
      },
      {
        id: 4,
        name: servicesData[8].name,
        price: 20000,
        description: "Dentures Treatment",
      },
    ],
  },
  {
    id: 876543,
    to: memberData[4],
    total: 19000,
    createdDate: "08/01/2023",
    dueDate: "12/01/2023",
    items: [
      {
        id: 1,
        name: servicesData[5].name,
        price: 5000,
        description: "Dental Veneers Treatment",
      },
      {
        id: 2,
        name: servicesData[6].name,
        price: 16000,
        description: "Dental Braces Treatment",
      },
      {
        id: 3,
        name: servicesData[7].name,
        price: 10000,
        description: "Dental Sealants Treatment",
      },
      {
        id: 4,
        name: servicesData[8].name,
        price: 20000,
        description: "Dentures Treatment",
      },
      {
        id: 5,
        name: servicesData[3].name,
        price: 190000,
        description: "Dental Crowns Treatment",
      },
      {
        id: 6,
        name: servicesData[4].name,
        price: 15000,
        description: "Dental Bridges Treatment",
      },
    ],
  },
];

export const appointmentsData = [
  {
    id: 1,
    time: "2 hrs later",
    user: memberData[4],
    from: "10:00 AM",
    to: "12:00 PM",
    hours: 2,
    status: "Pending",
    doctor: memberData[0],
    date: "Jun 12, 2021",
  },
  {
    id: 2,
    time: "1 hrs ago",
    user: memberData[5],
    from: "13:00 Pm",
    to: "18:00 PM",
    hours: 5,
    status: "Cancel",
    doctor: memberData[1],
    date: "Feb 24, 2021",
  },
  {
    id: 3,
    time: "2 hrs ago",
    user: memberData[6],
    from: "10:00 AM",
    to: "12:00 PM",
    hours: 2,
    status: "Approved",
    doctor: memberData[2],
    date: "Mar 12, 2023",
  },
  {
    id: 4,
    time: "3 hrs later",
    user: memberData[7],
    from: "06:00 AM",
    to: "08:00 AM",
    hours: 3,
    status: "Pending",
    doctor: memberData[3],
    date: "Apr 06, 2023",
  },
  {
    id: 5,
    time: "4 hrs ago",
    user: memberData[3],
    from: "10:00 AM",
    to: "12:00 PM",
    hours: 7,
    status: "Approved",
    doctor: memberData[4],
    date: "May 18, 2023",
  },
];

export const transactionData = [
  {
    id: 1,
    user: memberData[0],
    date: "Mar 12, 2022",
    amount: 1.0,
    status: "Paid",
    method: "Tiền mặt",
    doctor: memberData[3],
  },
  {
    id: 2,
    user: memberData[1],
    date: "Agus 12, 2023",
    amount: 2300,
    status: "Paid",
    method: "NHCF",
    doctor: memberData[4],
  },
  {
    id: 3,
    user: memberData[2],
    date: "Jan 06, 2024",
    amount: 1200,
    status: "Pending",
    method: "Britam",
    doctor: memberData[5],
  },
  {
    id: 4,
    user: memberData[3],
    date: "Feb 18, 2025",
    amount: 1400,
    status: "Cancel",
    method: "NHCF",
    doctor: memberData[6],
  },
  {
    id: 5,
    user: memberData[4],
    date: "Mar 12, 2026",
    amount: 1230,
    status: "Pending",
    method: "Tiền mặt",
    doctor: memberData[7],
  },
  {
    id: 6,
    user: memberData[5],
    date: "Apr 12, 2027",
    amount: 1000,
    status: "Paid",
    method: "NHCF",
    doctor: memberData[0],
  },
  {
    id: 7,
    user: memberData[6],
    date: "May 12, 2028",
    amount: 8900,
    status: "Cancel",
    method: "Britam",
    doctor: memberData[1],
  },
  {
    id: 8,
    user: memberData[7],
    date: "Jun 12, 2029",
    amount: 1000,
    status: "Pending",
    method: "Britam",
    doctor: memberData[2],
  },
];

export const dashboardCards = [
  {
    id: 1,
    title: "Tổng số bệnh nhân",
    icon: TbUsers,
    value: 1600,
    percent: 45.06,
    color: ["bg-subMain", "text-subMain", "#66B5A3"],
    datas: [92, 80, 45, 15, 49, 77, 70, 51, 110, 20, 90, 60],
  },
  {
    id: 2,
    title: "Cuộc hẹn",
    icon: TbCalendar,
    value: 130,
    percent: 25.06,
    color: ["bg-yellow-500", "text-yellow-500", "#F9C851"],
    datas: [20, 50, 75, 15, 108, 97, 70, 41, 50, 20, 90, 60],
  },
  {
    id: 3,
    title: "Tổng số điều dưỡng",
    icon: TbFile,
    value: 100,
    percent: 65.06,
    color: ["bg-green-500", "text-green-500", "#34C759"],
    datas: [92, 80, 45, 15, 49, 77, 70, 51, 110, 20, 90, 60],
  },
  {
    id: 4,
    title: "Tổng thu nhập",
    icon: MdOutlineAttachMoney,
    value: 4590,
    percent: 45.06,
    color: ["bg-red-500", "text-red-500", "#FF3B30"],
    datas: [20, 50, 75, 15, 108, 97, 70, 41, 50, 20, 90, 60],
  },
];

export const notificationsData = [
  {
    id: 1,
    action: 1,
    user: memberData[0],
    time: "2 giờ trước",
  },
  {
    id: 2,
    action: 2,
    user: memberData[1],
    time: "2 ngày trước",
  },
  {
    id: 3,
    action: 1,
    user: memberData[2],
    time: "3 ngày trước",
  },
  {
    id: 4,
    action: 2,
    user: memberData[3],
    time: "4 ngày trước",
  },
];

export const shareData = [
  {
    id: 1,
    icon: HiOutlineMail,
    title: "Email",
    description: "Gửi đến địa chỉ email của bệnh nhân",
  },
  {
    id: 2,
    icon: MdOutlineTextsms,
    title: "SMS",
    description: "Gửi đến số điện thoại của bệnh nhân",
  },
  {
    id: 3,
    icon: FaWhatsapp,
    title: "WhatsApp",
    description: "Gửi đến tài khoản WhatsApp của bệnh nhân",
  },
  {
    id: 4,
    icon: FaTelegramPlane,
    title: "Telegram",
    description: "Gửi đến tài khoản Telegram của bệnh nhân",
  },
];

export const medicineData = [
  {
    id: 1,
    name: "Paracetamol",
    measure: "Tablet",
    stock: 400,
    price: 1000,
    status: "Available",
    instraction: "After meal",
  },
  {
    id: 2,
    name: "Amoxicillin",
    measure: "Capsule",
    stock: 200,
    price: 2300,
    status: "Available",
    instraction: "After meal",
  },
  {
    id: 3,
    name: "Ibuprofen",
    measure: "mm",
    stock: 0,
    price: 5000,
    status: "Out of stock",
    instraction: "Before meal",
  },
  {
    id: 4,
    name: "Aspirin",
    measure: "cm",
    stock: 370,
    price: 3500,
    status: "Available",
    instraction: "After meal",
  },
  {
    id: 5,
    name: "Diazepam",
    measure: "gm",
    stock: 0,
    price: 12000,
    status: "Out of stock",
    instraction: "Before meal",
  },
  {
    id: 6,
    name: "Lorazepam",
    measure: "mg",
    stock: 123,
    price: 15500,
    status: "Available",
    instraction: "Before meal",
  },
  {
    id: 7,
    name: "Codeine",
    measure: "ml",
    stock: 1,
    price: 30000,
    status: "Available",
    instraction: "After meal",
  },
  {
    id: 8,
    name: "Tramadol",
    measure: "lb",
    stock: 0,
    price: 200,
    status: "Out of stock",
    instraction: "Before meal",
  },
];

export const patientTab = [
  {
    id: 1,
    title: "Medical Records",
    icon: TbChartHistogram,
  },
  {
    id: 2,
    title: "Appointments",
    icon: BiCalendar,
  },
  {
    id: 3,
    title: "Invoices",
    icon: RiFileList3Line,
  },
  {
    id: 4,
    title: "Payments",
    icon: RiMoneyDollarCircleLine,
  },
  {
    id: 5,
    title: "Images",
    icon: RiImageLine,
  },
  {
    id: 6,
    title: "Dental Chart",
    icon: RiStethoscopeLine,
  },
  {
    id: 7,
    title: "Patient Information",
    icon: RiUserLine,
  },
  {
    id: 8,
    title: "Health Information",
    icon: RiHeartLine,
  },
];

export const doctorTab = [
  {
    id: 1,
    title: "Personal Information",
    icon: RiUserLine,
  },
  {
    id: 2,
    title: "Customers",
    icon: BiUserPlus,
  },
  {
    id: 3,
    title: "Appointments",
    icon: BiCalendar,
  },
  {
    id: 4,
    title: "Payments",
    icon: RiMoneyDollarCircleLine,
  },
  {
    id: 5,
    title: "Invoices",
    icon: RiFileList3Line,
  },
  {
    id: 6,
    title: "Access Control",
    icon: TbLockAccess,
  },
  {
    id: 7,
    title: "Change Password",
    icon: RiLockPasswordLine,
  },
];

export const medicalRecodData = [
  {
    id: 1,
    date: "13 Tháng 1, 2021",
    amount: 150000,
    data: [
      {
        id: 1,
        title: "Triệu chứng",
        value: "Chảy máu chân răng, Đau răng, Hôi miệng",
      },
      {
        id: 2,
        title: "Chẩn đoán",
        value: "Viêm nướu, Sâu răng, Viêm nha chu",
      },
      {
        id: 3,
        title: "Điều trị",
        value: "Trám răng, Đóng chốt răng, Cấy ghép Implant, Nhổ răng",
      },
      {
        id: 4,
        title: "Kê đơn",
        value: "Paracetamol, Amoxicillin, Ibuprofen, Aspirin",
      },
    ],
    attachments: [
      "https://placehold.it/300x300",
      "https://placehold.it/300x300",
      "https://placehold.it/300x300",
      "https://placehold.it/300x300",
    ],
    vitalSigns: [
      "Huyết áp: 120/80 mmHg",
      "Nhịp tim: 80 bpm",
      "Nhịp thở: 16 bpm",
      "Nhiệt độ: 36,5 °C",
      "Độ bão hòa Oxy: 98%",
    ],
  },
  {
    id: 2,
    date: "10 Tháng 2, 2022",
    amount: 300000,
    data: [
      {
        id: 1,
        title: "Triệu chứng",
        value: "Thức ăn mắc kẹt, Thay răng bị mất, Hôi miệng",
      },
      {
        id: 2,
        title: "Chẩn đoán",
        value: "Sâu răng, Viêm nha chu, Sai khớp cắn",
      },
      {
        id: 3,
        title: "Điều trị",
        value: "Làm sạch bề mặt răng, Cạo vôi răng sâu, Nhổ răng",
      },
      {
        id: 4,
        title: "Kê đơn",
        value: "Benzocaine, Lidocaine, Mepivacaine, Prilocaine",
      },
    ],
    vitalSigns: [
      "Cân nặng: 60 kg",
      "Chiều cao: 170 cm",
      "BMI: 20,76 kg/m²",
      "Huyết áp: 120/80 mmHg",
    ],
  },
  {
    id: 3,
    date: "20 Tháng 3, 2022",
    amount: 500000,
    data: [
      {
        id: 1,
        title: "Triệu chứng",
        value: "Răng gãy, Răng cầu, Răng bọc sứ ở răng cửa",
      },
      {
        id: 2,
        title: "Chẩn đoán",
        value: "Tụt nướu không xác định, Sâu răng không xác định",
      },
      {
        id: 3,
        title: "Điều trị",
        value: "Tư vấn, Cạo vôi răng, Cạo chân răng, Nhổ răng",
      },
      {
        id: 4,
        title: "Kê đơn",
        value: "Gel nướu, Chlorhexidine, Fluoride, Canxi",
      },
    ],
    vitalSigns: [
      "Nhiệt độ: 36,5 °C",
      "Độ bão hòa Oxy: 98%",
      "Huyết áp: 120/80 mmHg",
      "Nhịp tim: 80 bpm",
      "Nhịp thở: 16 bpm",
    ],
  },
  {
    id: 4,
    date: "10 Tháng 4, 2022",
    amount: 760000,
    data: [
      {
        id: 1,
        title: "Triệu chứng",
        value: "Đau răng, Hôi miệng, Chảy máu chân răng",
      },
      {
        id: 2,
        title: "Chẩn đoán",
        value: "Viêm nướu loét hoại tử, Viêm nha chu",
      },
      {
        id: 3,
        title: "Điều trị",
        value: "Răng sứ, Cầu răng, Veneer, Cấy ghép Implant",
      },
      {
        id: 4,
        title: "Kê đơn",
        value: "Tramadol, Codeine, Morphine, Oxycodone",
      },
    ],
    vitalSigns: [
      "Lượng đường: 120 mg/dL",
      "Độ bão hòa Oxy: 98%",
      "Cholesterol: 200 mg/dL",
      "Huyết áp: 120/80 mmHg",
    ],
  },
];

export const doctorsData = [
  {
    id: 1,
    user: memberData[0],
    title: "Nuser.",
  },
  {
    id: 2,
    user: memberData[1],
    title: "Nuser.",
  },
  {
    id: 3,
    user: memberData[2],
    title: "Nuser.",
  },
  {
    id: 4,
    user: memberData[3],
    title: "Nuser.",
  },
];

export const receptionsData = [
  {
    id: 1,
    user: memberData[6],
    title: "Nuser.",
  },
  {
    id: 2,
    user: memberData[7],
    title: "Nuser.",
  },
  {
    id: 3,
    user: memberData[5],
    title: "Nuser.",
  },
  {
    id: 4,
    user: memberData[4],
    title: "Nuser.",
  },
  {
    id: 5,
    user: memberData[2],
    title: "Nuser.",
  },
  {
    id: 6,
    user: memberData[1],
    title: "Nuser.",
  },
];

import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import { FaFacebookMessenger } from "react-icons/fa";
import {
  BsArrowDownLeft,
  BsArrowDownRight,
  BsArrowUpRight,
  BsCheckCircleFill,
  BsClockFill,
  BsXCircleFill,
} from "react-icons/bs";
import { DashboardBigChart, DashboardSmallChart } from "../components/Charts";
import {
  appointmentsData,
  getDashboardCards,
  memberData,
  transactionData,
} from "../components/Datas";
import { Transactiontable } from "../components/Tables";
import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import { countUsers } from "../api/auth.js";
import { getPatients } from "../api/bookings.js";
import { io } from 'socket.io-client'
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPayment } from "../store/paymentSlice.js";
import { countBookingsLast12Months } from "../store/dashboardSlice.js";
import { countStaffInLast12Months } from "../store/staffSlice.js";
import { countTotalAmountMonth, countTotalMonthRevenue } from "../store/paymentSlice.js";

const socket = io('http://localhost:5000/');

function Dashboard() {
  const [userCount, setUserCount] = useState([]);
  const [patients, setPatients] = useState([]);
  const { allPayments: payments, loading, error } = useSelector((state) => state.payment)
  const { bookingsLast12Months: bookings } = useSelector((state) => state.dashboard)
  const { staffCount } = useSelector((state) => state.staff)
  const { totalAmountMonth, totalMonthRevenue } = useSelector((state) => state.payment)
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await countUsers();
        setUserCount(data);
        // console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getPatients();
        setPatients(data);
        // console.log("patients:", patients);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    }
    fetchPatients();
  }, []);

  useEffect(() => {
    dispatch(fetchAllPayment());
    dispatch(countBookingsLast12Months());
    dispatch(countStaffInLast12Months());
    dispatch(countTotalAmountMonth());
    dispatch(countTotalMonthRevenue());
  }, [dispatch])


  // console.log("bk", bookings.counts);
  // console.log("st", staffCount?.data);
  // console.log("st", totalAmountMonth?.totals);
  // console.log("revenue", totalMonthRevenue);

  const appointmentsData = bookings?.counts;
  const revenueData = totalAmountMonth?.totals;
  const staffsData = staffCount?.data;
  const dashboardCards = getDashboardCards(userCount, appointmentsData, staffsData, revenueData);

  // const data = [30, 40, 25, 50, 49, 21, 70, 51, 42, 60, 40, 20];
  const data = totalMonthRevenue?.revenue;

  return (
    <Layout>
      {/* {messger} */}
      <button className="w-16 animate-bounce h-16 border border-border z-50 bg-subMain text-white rounded-full flex-colo fixed bottom-8 right-12 button-fb">
        <FaFacebookMessenger className="text-2xl" />
      </button>

      {/* boxes */}
      <div className="w-full grid xl:grid-cols-4 gap-6 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">
        {dashboardCards.map((card, index) => (
          <div
            key={card.id}
            className=" bg-white rounded-xl border-[1px] border-border p-5"
          >
            <div className="flex gap-4 items-center">
              <div
                className={`w-10 h-10 flex-colo bg-opacity-10 rounded-md ${card.color[1]} ${card.color[0]}`}
              >
                <card.icon />
              </div>
              <h2 className="text-sm font-medium">{card.title}</h2>
            </div>
            <div className="grid grid-cols-8 gap-4 mt-4 bg-dry py-5 px-8 items-center rounded-xl">
              <div className="col-span-5">
                {/* statistc */}
                <DashboardSmallChart data={card.datas} colors={card.color[2]} />
              </div>
              <div className="flex flex-col gap-4 col-span-3">
                <h4 className="text-md font-medium">
                  {card.value}
                  {
                    card.id === 4 ? "" : "+"
                  }
                </h4>
                <p className={`text-sm flex gap-2 ${card.color[1]}`}>
                  {card.percent > 50 && <BsArrowUpRight />}
                  {card.percent > 30 && card.percent < 50 && (
                    <BsArrowDownRight />
                  )}
                  {card.percent < 30 && <BsArrowDownLeft />}
                  {card.percent}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full my-6 grid xl:grid-cols-8 grid-cols-1 gap-6">
        <div className="xl:col-span-6  w-full">
          <div className="bg-white rounded-xl border-[1px] border-border p-5">
            <div className="flex-btn gap-2">
              <h2 className="text-sm font-medium">Earning Reports</h2>
              <p className="flex gap-4 text-sm items-center">
                5.44%{" "}
                <span className="py-1 px-2 bg-subMain text-white text-xs rounded-xl">
                  +2.4%
                </span>
              </p>
            </div>
            {/* Earning Reports */}
            <div className="mt-4">
              <DashboardBigChart data={data} />
            </div>
          </div>
          {/* transaction */}
          <div className="mt-6 bg-white rounded-xl border-[1px] border-border p-5">
            <div className="flex-btn gap-2">
              <h2 className="text-sm font-medium">Recent Transaction</h2>
              <p className="flex gap-4 text-sm items-center">
                Today{" "}
                <span className="py-1 px-2 bg-subMain text-white text-xs rounded-xl">
                  27000$
                </span>
              </p>
            </div>
            {/* table */}
            <div className="mt-4 overflow-x-scroll">
              <Transactiontable
                data={payments.slice(0, 5)}
                action={false}
              />
            </div>
          </div>
        </div>
        {/* side 2 */}
        <div
          data-aos="fade-left"
          data-aos-duration="1000"
          data-aos-delay="10"
          data-aos-offset="200"
          className="xl:col-span-2 xl:block grid sm:grid-cols-2 gap-6"
        >
          {/* recent patients */}
          <div className="bg-white rounded-xl border-[1px] border-border p-5">
            <h2 className="text-sm font-medium">Recent Patients</h2>
            {patients.map((member, index) => (
              <Link
                to={`/patients/preview/${member._id}`}
                key={index}
                className="flex-btn gap-4 mt-6 border-b pb-4 border-border"
              >
                <div className="flex gap-4 items-center">
                  {/* <img
                    src={member.image}
                    alt="member"
                    className="w-10 h-10 rounded-md object-cover"
                  /> */}
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xs font-medium">{member.firstName} {member.lastName}</h3>
                    <p className="text-xs text-gray-400">{member.bookedByPhone}</p>
                  </div>
                </div>
                <p className="text-xs text-textGray">2:00 PM</p>
              </Link>
            ))}
          </div>
          {/* today apointments */}
          {/* <div className="bg-white rounded-xl border-[1px] border-border p-5 xl:mt-6">
            <h2 className="text-sm mb-4 font-medium">Today Appointments</h2>
            {appointmentsData.map((appointment, index) => (
              <div
                key={appointment.id}
                className="grid grid-cols-12 gap-2 items-center"
              >
                <p className="text-textGray text-[12px] col-span-3 font-light">
                  {appointment.time}
                </p>
                <div className="flex-colo relative col-span-2">
                  <hr className="w-[2px] h-20 bg-border" />
                  <div
                    className={`w-7 h-7 flex-colo text-sm bg-opacity-10
                   ${
                     appointment.status === "Pending" &&
                     "bg-orange-500 text-orange-500"
                   }
                  ${
                    appointment.status === "Cancel" && "bg-red-500 text-red-500"
                  }
                  ${
                    appointment.status === "Approved" &&
                    "bg-green-500 text-green-500"
                  }
                   rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
                  >
                    {appointment.status === "Pending" && <BsClockFill />}
                    {appointment.status === "Cancel" && <BsXCircleFill />}
                    {appointment.status === "Approved" && <BsCheckCircleFill />}
                  </div>
                </div>
                <Link
                  to="/appointments"
                  className="flex flex-col gap-1 col-span-6"
                >
                  <h2 className="text-xs font-medium">
                    {appointment.user?.title}
                  </h2>
                  <p className="text-[12px] font-light text-textGray">
                    {appointment.from} - {appointment.to}
                  </p>
                </Link>
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;

import React, { useEffect, useState } from "react";
import Layout from "../../Layout";
import PersonalInfo from "../../components/UsedComp/PersonalInfo";
import ChangePassword from "../../components/UsedComp/ChangePassword";
import { Link, useParams } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import PatientsUsed from "../../components/UsedComp/PatientsUsed";
import AppointmentsUsed from "../../components/UsedComp/AppointmentsUsed";
import { doctorTab } from "../../components/Datas";
import PaymentsUsed from "../../components/UsedComp/PaymentUsed";
import InvoiceUsed from "../../components/UsedComp/InvoiceUsed";
import ChangePasswordStaffs from "../../components/UsedComp/ChangePasswordStaffs";
import Access from "../../components/Access";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchStaffById } from "../../store/staffSlice";
import Loading from "../../components/Loading";

function DoctorProfile() {
  const location = useLocation();
  const [activeTab, setActiveTab] = React.useState(1);
  const { selectedStaff, loading, error } = useSelector((state) => state.staff);

  const { _id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tabFromQuery = parseInt(queryParams.get("tab")) || 1;
    setActiveTab(tabFromQuery);
  }, [location.search]);

  const tabPanel = () => {
    switch (activeTab) {
      case 1:
        return <PersonalInfo titles={true} />;
      case 2:
        return <PatientsUsed />;
      case 3:
        return <AppointmentsUsed doctor={true} />;
      case 4:
        return <PaymentsUsed doctor={true} />;
      case 5:
        return <InvoiceUsed />;
      // case 6:
      //   return <Access setAccess={setAccess} />;
      case 7:
        return <ChangePasswordStaffs />;
      default:
        return;
    }
  };

  useEffect(() => {
    if (_id) {
      dispatch(fetchStaffById(_id));
    }
  }, [dispatch, _id]);

  if (loading) return <Loading />;
  if (error) return <p>Lỗi: {error}</p>;

  if (!selectedStaff) return <p>Không tìm thấy thông tin nhân viên</p>;

  // console.log("dded", selectedStaff);

  return (
    <Layout>
      <div className="flex items-center gap-4">
        <Link
          to="/staffs"
          className="bg-white border border-subMain border-dashed rounded-lg py-3 px-4 text-md"
        >
          <IoArrowBackOutline />
        </Link>
        <h1 className="text-xl font-semibold">
          {selectedStaff.firstName} {selectedStaff.lastName}
        </h1>
      </div>
      <div className=" grid grid-cols-12 gap-6 my-8 items-start">
        <div
          data-aos="fade-right"
          data-aos-duration="1000"
          data-aos-delay="100"
          data-aos-offset="200"
          className="col-span-12 flex-colo gap-6 lg:col-span-4 bg-white rounded-xl border-[1px] border-border p-6 lg:sticky top-28"
        >
          <img
            src={selectedStaff.userId.avatar}
            alt="setting"
            className="w-40 h-40 rounded-full object-cover border border-dashed border-subMain"
          />
          <div className="gap-2 flex-colo">
            <h2 className="text-sm font-semibold">
              Dr. {selectedStaff.lastName}
            </h2>
            <p className="text-xs text-textGray">{selectedStaff.email}</p>
            <p className="text-xs">{selectedStaff.userId.phone}</p>
          </div>
          {/* tabs */}
          <div className="flex-colo gap-3 px-2 2xl:px-12 w-full">
            {doctorTab.map((tab, index) => (
              <button
                onClick={() => setActiveTab(tab.id)}
                key={index}
                className={`
                ${
                  activeTab === tab.id
                    ? "bg-text text-subMain"
                    : "bg-dry text-main hover:bg-text hover:text-subMain"
                }
                text-xs gap-4 flex items-center w-full p-4 rounded`}
              >
                <tab.icon className="text-lg" /> {tab.title}
              </button>
            ))}
          </div>
        </div>
        {/* tab panel */}
        <div
          data-aos="fade-left"
          data-aos-duration="1000"
          data-aos-delay="100"
          data-aos-offset="200"
          className="col-span-12 lg:col-span-8 bg-white rounded-xl border-[1px] border-border p-6"
        >
          {tabPanel()}
        </div>
      </div>
    </Layout>
  );
}

export default DoctorProfile;

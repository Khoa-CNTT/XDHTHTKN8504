import React from "react";
import Layout from "../../Layout";
import PersonalInfo from "../../components/UsedComp/PersonalInfo";
import ChangePassword from "../../components/UsedComp/ChangePassword";
import { Link } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import PatientsUsed from "../../components/UsedComp/PatientsUsed";
import AppointmentsUsed from "../../components/UsedComp/AppointmentsUsed";
import { doctorTab } from "../../components/Datas";
import PaymentsUsed from "../../components/UsedComp/PaymentUsed";
import InvoiceUsed from "../../components/UsedComp/InvoiceUsed";
import Access from "../../components/Access";

function DoctorProfile() {
  const [activeTab, setActiveTab] = React.useState(1);
  const [access, setAccess] = React.useState({});

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
      case 6:
        return <Access setAccess={setAccess} />;
      case 7:
        return <ChangePassword />;
      default:
        return;
    }
  };

  return (
    <Layout>
      <div className="flex items-center gap-4">
        <Link
          to="/doctors"
          className="bg-white border border-subMain border-dashed rounded-lg py-3 px-4 text-md"
        >
          <IoArrowBackOutline />
        </Link>
        <h1 className="text-xl font-semibold">Dr. Daudi Mburuge</h1>
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
            src="/images/user1.png"
            alt="setting"
            className="w-40 h-40 rounded-full object-cover border border-dashed border-subMain"
          />
          <div className="gap-2 flex-colo">
            <h2 className="text-sm font-semibold">Dr. Daudi Mburuge</h2>
            <p className="text-xs text-textGray">daudimburuge@gmail.com</p>
            <p className="text-xs">+254 712 345 678</p>
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

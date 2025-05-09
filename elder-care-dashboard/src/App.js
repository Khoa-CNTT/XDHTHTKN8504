// ********* This is the main component of the website *********

import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Aos from "aos";
import Dashboard from "./screens/Dashboard";
import Toast from "./components/Notifications/Toast";
import Payments from "./screens/Payments/Payments";
import Appointments from "./screens/Appointments";
import Patients from "./screens/Patients/Patients";
// import Campaings from "./screens/Campaings";
import Services from "./screens/Services";
import Invoices from "./screens/Invoices/Invoices";
import Settings from "./screens/Settings";
import CreateInvoice from "./screens/Invoices/CreateInvoice";
import EditInvoice from "./screens/Invoices/EditInvoice";
import PreviewInvoice from "./screens/Invoices/PreviewInvoice";
import EditPayment from "./screens/Payments/EditPayment";
import PreviewPayment from "./screens/Payments/PreviewPayment";
// import Medicine from "./screens/Medicine";
import PatientProfile from "./screens/Patients/PatientProfile";
import CreatePatient from "./screens/Patients/CreatePatient";
// <<<<<<< nghia-admin-dashboard
// import Nurses from "./screens/Nurses/Nurses";
// import NurseSalary from "./screens/Nurses/NursesSalary";
import DoctorProfile from "./screens/Nurses/DoctorProfile";
=======
import Staffs from "./screens/Staffs/Staff";
import DoctorProfile from "./screens/Staffs/DoctorProfile";
// >>>>>>> main
import Receptions from "./screens/Receptions";
import NewMedicalRecode from "./screens/Patients/NewMedicalRecode";
import NotFound from "./screens/NotFound";
import Login from "./screens/Login";
import ForgotPassword from "./screens/ForgotPassword";
import Register from "./screens/Register";
import Chat from "./screens/Chats/Chat";
import Booking from "./screens/Booking";

function App() {
  Aos.init();

  return (
    <>
      {/* Toaster */}
      <Toast />
      {/* Routes */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {/* invoce */}
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/invoices/create" element={<CreateInvoice />} />
          <Route path="/invoices/edit/:id" element={<EditInvoice />} />
          <Route path="/invoices/preview/:id" element={<PreviewInvoice />} />
          {/* payments */}
          <Route path="/payments" element={<Payments />} />
          <Route path="/payments/edit/:id" element={<EditPayment />} />
          <Route path="/payments/preview/:id" element={<PreviewPayment />} />
          {/* patient */}
          <Route path="/customers" element={<Patients />} />
          <Route path="/customers/preview/:id" element={<PatientProfile />} />
          <Route path="/customers/create" element={<CreatePatient />} />
          <Route
            path="/customers/visiting/:id"
            element={<NewMedicalRecode />}
          />
          {/* doctors */}
// <<<<<<< nghia-admin-dashboard
//           <Route path="/nurses" element={<Nurses />} />
//           <Route path="/nurses/nurse-salary" element={<NurseSalary />} />
// =======
          <Route path="/staffs" element={<Staffs />} />
// >>>>>>> main
          <Route path="/nurses/preview/:id" element={<DoctorProfile />} />

          {/* reception */}
          <Route path="/receptions" element={<Receptions />} />
          {/* others */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/bookings" element={<Booking />} />
          {/* <Route path="/campaigns" element={<Campaings />} /> */}
          <Route path="/chat" element={<Chat />} />
          {/* <Route path="/medicine" element={<Medicine />} /> */}
          <Route path="/services" element={<Services />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

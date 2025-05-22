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

import Staffs from "./screens/Staffs/Staff";
import DoctorProfile from "./screens/Staffs/DoctorProfile";
// >>>>>>> main
import Receptions from "./screens/Receptions";
import NewMedicalRecode from "./screens/Patients/NewMedicalRecode";
import NotFound from "./screens/NotFound";
import Login from "./screens/Login";
import ForgotPassword from "./screens/ForgotPassword";
import Register from "./screens/Register";
import Chat from "./screens/Chats/ChatLayout";
import Booking from "./screens/Booking";
import PreviewBooking from "./screens/previewBooking";
import RequireAuth from "./components/RequireAuth";
import Review from "./screens/Review";
function App() {
  Aos.init();

  return (
    <>
      {/* Toaster */}
      <Toast />
      {/* Routes */}
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />

          {/* Protected routes */}
          <Route
            path="*"
            element={
              <RequireAuth>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/invoices" element={<Invoices />} />
                  <Route path="/invoices/create" element={<CreateInvoice />} />
                  <Route path="/invoices/edit/:_id" element={<EditInvoice />} />
                  <Route
                    path="/invoices/preview/:_id"
                    element={<PreviewInvoice />}
                  />
                  <Route path="/payments" element={<Payments />} />
                  <Route path="/payments/edit/:_id" element={<EditPayment />} />
                  <Route
                    path="/payments/preview/:_id"
                    element={<PreviewPayment />}
                  />
                  <Route path="/customers" element={<Patients />} />
                  <Route
                    path="/customers/preview/:_id"
                    element={<PatientProfile />}
                  />
                  <Route path="/customers/create" element={<CreatePatient />} />
                  <Route
                    path="/customers/visiting/:_id"
                    element={<NewMedicalRecode />}
                  />
                  <Route path="/staffs" element={<Staffs />} />
                  <Route
                    path="/staffs/preview/:_id"
                    element={<DoctorProfile />}
                  />
                  <Route path="/receptions" element={<Receptions />} />
                  <Route path="/appointments" element={<Appointments />} />
                  <Route path="/bookings" element={<Booking />} />
                  <Route
                    path="/bookings/preview1/:_id"
                    element={<PreviewBooking />}
                  />
                  <Route path="/review" element={<Review />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

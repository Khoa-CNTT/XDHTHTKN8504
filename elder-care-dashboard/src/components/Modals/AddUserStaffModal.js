import React, { useState } from "react";
import Modal from "./Modal";
import { Button, Input, Select } from "../Form";
import { BiChevronDown } from "react-icons/bi";
import { sortsDatas } from "../Datas";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { toast } from "react-hot-toast";
import Access from "../Access";
import Uploader from "../Uploader";
import axios from "axios";

function AddUserStaffModal({ closeModal, isOpen, doctor, datas, onSuccess }) {
  const [instraction, setInstraction] = useState(sortsDatas.title[0]);
  const [access, setAccess] = useState({});
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [image, setImage] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State to store error messages for each field
  const [errors, setErrors] = useState({
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const handleSubmitUser = async (e) => {
    e.preventDefault();

    let formErrors = { ...errors };
    let hasError = false;

    // Validate inputs
    if (!phoneNumber) {
      formErrors.phoneNumber = "Số điện thoại không được để trống";
      hasError = true;
    }

    if (!password) {
      formErrors.password = "Mật khẩu không được để trống";
      hasError = true;
    }

    if (password !== confirmPassword) {
      formErrors.confirmPassword = "Mật khẩu và xác nhận mật khẩu không khớp";
      hasError = true;
    }

    if (!role) {
      formErrors.role = "Vui lòng chọn vai trò";
      hasError = true;
    }

    setErrors(formErrors);

    if (hasError) return;

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/signup",
        {
          phone: phoneNumber,
          password,
          role,
          avatar: image,
        }
      );
      const newId = response.data._id;
      toast.success("Thêm thành công!");
      setError(null);
      onSuccess(newId);
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      setError("An error occurred while creating the user");
      toast.error("Đăng ký thất bại!");
    }
  };
  console.log("role", role);

  return (
    <Modal
      closeModal={closeModal}
      isOpen={isOpen}
      title={doctor ? "Add Doctor" : datas?.id ? "Edit Stuff" : "Add Stuff"}
      width={"max-w-3xl"}
    >
      <div className="flex gap-3 flex-col col-span-6 mb-6">
        <p className="text-sm">Profile Image</p>
        <Uploader setImage={setImage} image={image} />
      </div>

      <div className="flex-colo gap-6">
        <div className="grid sm:grid-cols-1 gap-4 w-full">
          <Input
            label="Số điện thoại"
            color={true}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          {errors.phoneNumber && (
            <p className="text-sm text-red-500">{errors.phoneNumber}</p>
          )}
        </div>
        <div className="grid sm:grid-cols-1 gap-4 w-full">
          <Input
            type="password"
            label="Mật khẩu"
            color={true}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
        </div>
        <div className="grid sm:grid-cols-1 gap-4 w-full">
          <Input
            type="password"
            label="Xác nhận mật khẩu"
            color={true}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword}</p>
          )}
        </div>

        <div className="grid sm:grid-cols-1 gap-4 w-full">
          <div className="flex flex-col gap-2 w-full">
            <label className="text-sm font-medium text-gray-700">Vai trò</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`w-full bg-transparent text-sm mt-3 p-4 border ${
                role ? "border-border" : "border-red-500"
              } rounded-lg focus:border focus:border-subMain`}
            >
              <option
                value=""
                className="p-4 text-sm font-light bg-white text-black"
              >
                -- Chọn vai trò --
              </option>
              <option
                value="doctor"
                className="p-4 text-sm font-light bg-white text-black"
              >
                Bác sĩ
              </option>
              <option
                value="nurse"
                className="p-4 text-sm font-light bg-white text-black"
              >
                Điều dưỡng
              </option>
            </select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role}</p>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <button
            onClick={closeModal}
            className="bg-red-600 bg-opacity-5 text-red-600 text-sm p-4 rounded-lg font-light"
          >
            Cancel
          </button>
          <Button
            label="Tiếp"
            Icon={HiOutlineCheckCircle}
            onClick={handleSubmitUser}
          />
        </div>
      </div>
    </Modal>
  );
}

export default AddUserStaffModal;

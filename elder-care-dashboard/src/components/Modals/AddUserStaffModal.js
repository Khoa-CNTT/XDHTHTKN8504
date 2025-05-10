import React, { useState } from "react";
import Modal from "./Modal";
import { Button, Input, Select } from "../Form";
import { BiChevronDown } from "react-icons/bi";
import { sortsDatas } from "../Datas";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { toast } from "react-hot-toast";
import Access from "../Access";
import Uploader from "../Uploader";

function AddUserStaffModal({ closeModal, isOpen, doctor, datas }) {
  const [instraction, setInstraction] = useState(sortsDatas.title[0]);
  const [access, setAccess] = useState({});
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const color = true;

  const validateFields = () => {
    const newErrors = {};
    if (!phone.trim()) newErrors.phone = "Số điện thoại không được để trống";
    if (!password.trim()) newErrors.password = "Mật khẩu không được để trống";
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }
    if (!role) newErrors.role = "Vui lòng chọn vai trò";
    return newErrors;
  };

  const onSubmit = () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Nếu dữ liệu hợp lệ, xử lý tiếp theo
    toast.success("Dữ liệu hợp lệ. Đang xử lý...");
  };

  return (
    <Modal
      closeModal={closeModal}
      isOpen={isOpen}
      title={doctor ? "Add Doctor" : datas?.id ? "Edit Stuff" : "Add Stuff"}
      width={"max-w-3xl"}
    >
      <div className="flex gap-3 flex-col col-span-6 mb-6">
        <p className="text-sm">Profile Image</p>
        <Uploader />
      </div>

      <div className="flex-colo gap-6">
        <div className="grid sm:grid-cols-1 gap-4 w-full">
          <Input
            label="Số điện thoại"
            color={true}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {errors.phone && (
            <p className="text-sm text-red-500 ">{errors.phone}</p>
          )}
        </div>

        <Input
          label="Mật khẩu"
          type="password"
          color={true}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && (
          <p className="text-sm text-red-500  text-left w-full">
            {errors.password}
          </p>
        )}

        <Input
          label="Xác nhận mật khẩu"
          type="password"
          color={true}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500  text-left w-full">
            {errors.confirmPassword}
          </p>
        )}

        <div className="grid sm:grid-cols-1 gap-4 w-full">
          <div className="flex flex-col gap-2 w-full">
            <label className="text-sm font-medium text-gray-700">Vai trò</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`w-full bg-transparent text-sm mt-3 p-4 border ${
                color ? "border-border font-light" : "border-white text-white"
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
              <p className="text-sm text-red-500 ">{errors.role}</p>
            )}
          </div>
        </div>

        {/* buttons */}
        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <button
            onClick={closeModal}
            className="bg-red-600 bg-opacity-5 text-red-600 text-sm p-4 rounded-lg font-light"
          >
            Cancel
          </button>
          <Button label="Save" Icon={HiOutlineCheckCircle} onClick={onSubmit} />
        </div>
      </div>
    </Modal>
  );
}

export default AddUserStaffModal;

import React, { useState } from "react";
import Modal from "./Modal";
import { Button, Input } from "../Form";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { toast } from "react-hot-toast";
import axios from "axios";

function AddDoctorModal({ closeModal, isOpen, doctor, id }) {
  const [isDoctor, setIsDoctor] = useState(doctor);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [experience, setExperience] = useState("");

  const [errors, setErrors] = useState({});

  const onSubmit = async () => {
    const newErrors = {};

    if (!firstName) newErrors.firstName = "Họ không được để trống";
    if (!lastName) newErrors.lastName = "Tên không được để trống";
    if (!email) newErrors.email = "Email không được để trống";
    if (!specialization)
      newErrors.specialization = "Chuyên môn không được để trống";
    if (!licenseNumber)
      newErrors.licenseNumber = "Số giấy phép không được để trống";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    if (isDoctor) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/v1/doctors/create",
          {
            userId: id,
            firstName,
            lastName,
            email,
            specialization,
            licenseNumber,
            experience,
          }
        );
        toast.success("Thêm bác sĩ thành công");
        console.log("Đăng ký thành công:", response.data);
        closeModal();
      } catch (error) {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
        toast.error("Đăng ký thất bại!");
      }
    } else {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/v1/nurses/create",
          {
            userId: id,
            firstName,
            lastName,
            email,
            specialization,
            licenseNumber,
          }
        );
        toast.success("Thêm điều dưỡng thành công");
        console.log("Đăng ký thành công:", response.data);
        closeModal();
      } catch (error) {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
        toast.error("Đăng ký thất bại!");
      }
    }
  };

  return (
    <Modal
      closeModal={closeModal}
      isOpen={isOpen}
      title={isDoctor ? "Thêm Bác sĩ" : "Thêm Điều dưỡng"}
      width={"max-w-3xl"}
    >
      <div className="flex-colo gap-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span
              className={
                isDoctor ? "text-blue-600 font-semibold" : "text-gray-400"
              }
            >
              Bác sĩ
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={!isDoctor}
                onChange={() => setIsDoctor((prev) => !prev)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-all duration-200"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 transform peer-checked:translate-x-5"></div>
            </label>
            <span
              className={
                !isDoctor ? "text-green-600 font-semibold" : "text-gray-400"
              }
            >
              Điều dưỡng
            </span>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <div>
            <Input
              label="Họ"
              color={true}
              placeholder="Họ"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
            )}{" "}
            {/* Thông báo lỗi */}
          </div>
          <div>
            <Input
              label="Tên"
              color={true}
              placeholder="Tên"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
            )}{" "}
            {/* Thông báo lỗi */}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <div>
            <Input
              type="email"
              label="Email"
              color={true}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}{" "}
            {/* Thông báo lỗi */}
          </div>
          <div>
            <Input
              label="Chuyên môn"
              color={true}
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            />
            {errors.specialization && (
              <p className="text-sm text-red-500 mt-1">
                {errors.specialization}
              </p>
            )}{" "}
            {/* Thông báo lỗi */}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <div>
            <Input
              label="Số giấy phép"
              color={true}
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
            />
            {errors.licenseNumber && (
              <p className="text-sm text-red-500 mt-1">
                {errors.licenseNumber}
              </p>
            )}{" "}
            {/* Thông báo lỗi */}
          </div>
          {isDoctor && (
            <div>
              <Input
                label="Số năm làm nghề"
                color={true}
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* buttons */}
        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <button
            onClick={closeModal}
            className="bg-red-600 bg-opacity-5 text-red-600 text-sm p-4 rounded-lg font-light"
          >
            Thoát
          </button>
          <Button label="Thêm" Icon={HiOutlineCheckCircle} onClick={onSubmit} />
        </div>
      </div>
    </Modal>
  );
}

export default AddDoctorModal;

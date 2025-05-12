import React, { useState } from "react";
import Modal from "./Modal";
import { Button, Input, Switchi, Textarea } from "../Form";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { toast } from "react-hot-toast";
import axios from "axios";
import Uploader from "../Uploader.js";

const AddServiceModal = ({ closeModal, isOpen }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [percentage, setPercentage] = useState("");
  const [role, setRole] = useState("doctor");
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState("");

  const handleSubmit = async () => {
    const newErrors = {};

    if (!name) newErrors.name = "Tên dịch vụ không được để trống";
    if (!price || isNaN(price)) newErrors.price = "Giá phải là một số hợp lệ";
    if (percentage === "" || isNaN(percentage))
      newErrors.percentage = "Tỉ lệ phần trăm phải là số";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/services/create",
        {
          name,
          description,
          price: Number(price),
          percentage: Number(percentage),
          role,
          imgUrl: image,
        }
      );
      toast.success("Thêm dịch vụ thành công");
      closeModal();
    } catch (error) {
      console.error("Lỗi khi thêm dịch vụ:", error.response || error.message);
      toast.error("Không thể thêm dịch vụ");
    }
  };

  console.log("image", image);

  return (
    <Modal
      closeModal={closeModal}
      isOpen={isOpen}
      title="Thêm Dịch Vụ"
      width="max-w-3xl"
    >
      <div className="flex-colo gap-6">
        {/* Upload Image */}
        <Uploader setImage={setImage} image={image} />

        {/* Tên dịch vụ */}
        <div className="w-full">
          <Input
            label="Tên dịch vụ"
            color={true}
            placeholder="Nhập tên dịch vụ"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name}</p>
          )}
        </div>

        {/* Giá */}
        <div className="w-full grid sm:grid-cols-2 gap-4">
          <Input
            label="Giá (vnd)"
            type="number"
            color={true}
            placeholder="Nhập giá"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          {errors.price && (
            <p className="text-sm text-red-500 mt-1">{errors.price}</p>
          )}
          {/* Phần trăm */}
          <Input
            label="Tỉ lệ phần trăm (%)"
            type="number"
            color={true}
            placeholder="Nhập phần trăm"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
          />
          {errors.percentage && (
            <p className="text-sm text-red-500 mt-1">{errors.percentage}</p>
          )}
        </div>

        {/* Vai trò */}
        <div className="w-full">
          <label className="text-sm block mb-2">Vai trò</label>
          <select
            className="w-full p-3 border border-border rounded-md bg-blue-500 text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="doctor">Bác sĩ</option>
            <option value="nurse">Điều dưỡng</option>
          </select>
        </div>

        {/* Mô tả */}
        <Textarea
          label="Mô tả"
          placeholder="Nhập mô tả dịch vụ..."
          color={true}
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Trạng thái */}
        <div className="flex items-center gap-2 w-full">
          <Switchi
            label="Trạng thái"
            checked={isActive}
            onChange={() => setIsActive(!isActive)}
          />
          <p
            className={`text-sm ${isActive ? "text-subMain" : "text-textGray"}`}
          >
            {isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
          </p>
        </div>

        {/* Buttons */}
        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <button
            onClick={closeModal}
            className="bg-red-600 bg-opacity-5 text-red-600 text-sm p-4 rounded-lg font-light"
          >
            Hủy
          </button>
          <Button
            label="Lưu"
            Icon={HiOutlineCheckCircle}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddServiceModal;

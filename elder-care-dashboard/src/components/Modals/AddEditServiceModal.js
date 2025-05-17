import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { Button, Input, Switchi, Textarea } from "../Form";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { toast } from "react-hot-toast";
import axios from "axios";
import Uploader from "../Uploader.js";

const AddEditServiceModal = ({ closeModal, isOpen, datas }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [percentage, setPercentage] = useState("");
  const [role, setRole] = useState("doctor");
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState("");

  // Load data khi sửa
  useEffect(() => {
    if (datas) {
      setName(datas.name || "");
      setPrice(datas.price || "");
      setDescription(datas.description || "");
      setIsActive(datas.status !== false); // nếu status là false => đã ngừng hoạt động
      setPercentage(datas.percentage || "");
      setRole(datas.role || "doctor");
      setImage(datas.imgUrl || "");
    }
  }, [datas]);

  const handleSubmit = async () => {
    const newErrors = {};

    if (!name) newErrors.name = "Tên dịch vụ không được để trống";
    if (!price || isNaN(price)) {
      newErrors.price = "Giá phải là số";
    } else if (parseFloat(price) < 0) {
      newErrors.price = "Giá không được nhỏ hơn 0";
    }
    if (percentage === "" || isNaN(percentage)) {
      newErrors.percentage = "Tỉ lệ phần trăm phải là số";
    } else if (parseFloat(percentage) < 0 || parseFloat(percentage) > 100) {
      newErrors.percentage = "Tỉ lệ phần trăm phải từ 0.1 đến 1";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      name,
      description,
      price: Number(price),
      percentage: Number(percentage),
      role,
      imgUrl: image,
      status: isActive,
    };

    console.log("payload", payload); console.log("Description:", description);

    try {
      if (datas?._id) {
        // Chế độ sửa
        await axios.put(
          `http://localhost:5000/api/v1/services/update-service/${datas._id}`,
          payload
        );
        toast.success("Cập nhật dịch vụ thành công");
      } else {
        // Chế độ thêm
        await axios.post(
          "http://localhost:5000/api/v1/services/create",
          payload
        );
        toast.success("Thêm dịch vụ thành công");
      }

      closeModal();
    } catch (error) {
      console.error("Lỗi:", error.response || error.message);
      toast.error("Thao tác thất bại");
    }
  };

  return (
    <Modal
      closeModal={closeModal}
      isOpen={isOpen}
      title={datas?._id ? "Cập nhật Dịch Vụ" : "Thêm Dịch Vụ"}
      width="max-w-3xl"
    >
      <div className="flex-colo gap-6">
        <Uploader setImage={setImage} image={image} />

        {/* <Input
          label="Tên dịch vụ"
          color={true}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập tên dịch vụ"
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>} */}

        <div className="w-full">
          <Input
            label="Tên dịch vụ"
            color={true}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên dịch vụ"
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1 ml-1">{errors.name}</p>
          )}
        </div>

        <div className="w-full grid sm:grid-cols-2 gap-4">
          <div className="w-full">
            <Input
              label="Giá (vnd)"
              type="number"
              min="0"
              color={true}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            {errors.price && (
              <p className="text-sm text-red-500 mt-1 ml-1">{errors.price}</p>
            )}
          </div>

          <div className="w-full">
            <Input
              label="Tỉ lệ phần trăm (%)"
              type="number"
              color={true}
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
            />
            {errors.percentage && (
              <p className="text-sm text-red-500 mt-1 ml-1">
                {errors.percentage}
              </p>
            )}
          </div>
        </div>

        <div className="w-full">
          <label className="text-sm block mb-2">Vai trò</label>
          <select
            className="w-full p-3 border border-border rounded-md bg-teal-100 text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option
              value=""
              className="p-4 text-sm font-light bg-white text-black"
            >
              -- Chọn vai trò --
            </option>
            <option value="doctor">Bác sĩ</option>
            <option value="nurse">Điều dưỡng</option>
          </select>
        </div>

        <Textarea
          label="Mô tả"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Nhập mô tả"
        />

        <div className="flex items-center gap-2 w-full">
          <Switchi checked={isActive} onChange={() => setIsActive(!isActive)} />
          <p
            className={`text-sm ${isActive ? "text-subMain" : "text-textGray"}`}
          >
            {isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
          </p>
        </div>

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

export default AddEditServiceModal;

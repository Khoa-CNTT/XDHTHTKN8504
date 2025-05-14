import React, { useState } from "react";
import { Button, Input } from "../Form";
import { toast } from "react-hot-toast";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { RiDeleteBin5Line } from "react-icons/ri";
import axios from "axios";

function PersonalInfo() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const role = "family_member";
  const profiles = [];

  const validate = () => {
    const newErrors = {};

    if (!phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!password.trim()) newErrors.password = "Vui lòng nhập mật khẩu";
    if (!confirmPassword.trim())
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";

    return newErrors;
  };

  const handleSave = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/signup",
        {
          phone,
          password,
          role,
          profiles,
        }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Đăng ký tài khoản thành công!");
        setPhone("");
        setPassword("");
        setConfirmPassword("");
      } else {
        toast.error("Lỗi không xác định!");
      }
    } catch (error) {
      console.error("Đăng ký lỗi:", error);
      const message = error.response?.data?.message || "Lỗi kết nối API";
      toast.error(message);
    }
  };

  return (
    <div className="flex-colo gap-4">
      {/* Phone */}
      <Input
        label="Số điện thoại"
        color={true}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

      {/* Password */}
      <Input
        type="password"
        label="Mật khẩu"
        color={true}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {errors.password && (
        <p className="text-red-500 text-sm">{errors.password}</p>
      )}

      {/* Confirm Password */}
      <Input
        type="password"
        label="Xác nhận mật khẩu"
        color={true}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {errors.confirmPassword && (
        <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
      )}

      {/* Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <Button
          label={"Xóa tài khoản"}
          Icon={RiDeleteBin5Line}
          onClick={() => {
            toast.error("Chức năng này hiện chưa khả dụng");
          }}
        />
        <Button
          label={"Lưu thay đổi"}
          Icon={HiOutlineCheckCircle}
          onClick={handleSave}
        />
      </div>
    </div>
  );
}

export default PersonalInfo;

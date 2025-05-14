import React, { useState, useEffect } from "react";
import { Button, Input } from "../Form";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { toast } from "react-hot-toast";
import axios from "axios";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState(null); // State to store user info

  // Fetch user info from localStorage when the component mounts
  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!oldPassword.trim())
      newErrors.oldPassword = "Vui lòng nhập mật khẩu cũ";
    if (!newPassword.trim())
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    if (!confirmPassword.trim())
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
    else if (newPassword !== confirmPassword)
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    return newErrors;
  };

  const handleChangePassword = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Ensure the user is logged in before allowing password change
    if (!user) {
      toast.error("Vui lòng đăng nhập trước khi thay đổi mật khẩu");
      return;
    }

    try {
      const response = await axios.patch(
        "http://localhost:5000/api/v1/auth/change-password",
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token for auth
          },
        }
      );

      if (response.status === 200) {
        toast.success("Đổi mật khẩu thành công!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setErrors({});
      } else {
        toast.error("Không thể đổi mật khẩu. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Đổi mật khẩu lỗi:", error);
      const message =
        error.response?.data?.message || "Lỗi kết nối tới máy chủ";
      toast.error(message);
    }
  };

  return (
    <div className="flex-colo gap-4">
      {/* Old password */}
      <Input
        label="Mật khẩu cũ"
        color={true}
        type="password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      {errors.oldPassword && (
        <p className="text-red-500 text-sm">{errors.oldPassword}</p>
      )}

      {/* New password */}
      <Input
        label="Mật khẩu mới"
        color={true}
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      {errors.newPassword && (
        <p className="text-red-500 text-sm">{errors.newPassword}</p>
      )}

      {/* Confirm password */}
      <Input
        label="Xác nhận Mật khẩu mới"
        color={true}
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {errors.confirmPassword && (
        <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
      )}

      {/* Submit button */}
      <Button
        label={"Lưu"}
        Icon={HiOutlineCheckCircle}
        onClick={handleChangePassword}
      />
    </div>
  );
}

export default ChangePassword;

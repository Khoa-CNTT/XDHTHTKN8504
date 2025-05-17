import React, { useState, useEffect } from "react";
import { Button, Input } from "../Form";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { toast } from "react-hot-toast";
import axios from "axios";
import MedicalRecodModal from "../Modals/MedicalRecodModal";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeStaffPassword } from "../../store/staffSlice";

function ChangePasswordStaffs() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState(null);
  const { _id } = useParams()
  const dispatch = useDispatch();

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

    try {
      await dispatch(changeStaffPassword({
        userId: _id,
        oldPassword,
        newPassword
      })).unwrap();
      toast.success("Đổi mật khẩu thành công!");
    } catch (err) {
      // err có thể là object { message, error } → lấy message
      toast.error(err?.message || "Đổi mật khẩu thất bại!");
    }
  };

  return (
    <div className="flex-colo gap-4">
      {/* Old password */}
      <Input
        label="Mật khẩu cũ của nhân viên"
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

export default ChangePasswordStaffs;

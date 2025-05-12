import React, { useState } from "react";
import { Button, Input } from "../components/Form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BiLogInCircle } from "react-icons/bi";

function ForgotPassword() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!phone) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!newPassword) newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    if (!confirmPassword)
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    if (newPassword && confirmPassword && newPassword !== confirmPassword)
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/v1/auth/forgot-password", {
        phone,
        newPassword,
      });

      alert("Đặt lại mật khẩu thành công!");
      navigate("/login");
    } catch (err) {
      setErrors({
        general: err.response?.data?.message || "Đặt lại mật khẩu thất bại!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex-colo bg-greenok">
      <form className="w-2/5 p-8 rounded-2xl mx-auto bg-white flex-colo">
        <img
          src="/images/logo1.png"
          alt="logo"
          className="w-48 h-25 object-contain"
        />
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Đặt lại mật khẩu
        </h2>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Nhập số điện thoại đã đăng ký và mật khẩu mới của bạn.
        </p>

        <div className="flex flex-col gap-4 w-full mb-6">
          <div>
            <Input
              label="Số điện thoại"
              type="text"
              color={true}
              placeholder="Nhập số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <Input
              label="Mật khẩu mới"
              type="password"
              color={true}
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>

          <div>
            <Input
              label="Xác nhận mật khẩu"
              type="password"
              color={true}
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        {errors.general && (
          <p className="text-red-500 text-sm mb-4">{errors.general}</p>
        )}

        <Button
          label={loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
          Icon={BiLogInCircle}
          onClick={handleForgotPassword}
        />

        <p className="text-sm text-gray-600 mt-4">
          Đã nhớ mật khẩu?{" "}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Quay lại đăng nhập
          </span>
        </p>
      </form>
    </div>
  );
}

export default ForgotPassword;

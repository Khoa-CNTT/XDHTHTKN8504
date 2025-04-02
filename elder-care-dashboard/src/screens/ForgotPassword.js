import React from "react";
import { Button, Input } from "../components/Form";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex-colo bg-greenok">
      <form className="w-2/5 p-8 rounded-2xl mx-auto bg-white flex-colo">
        <img
          src="/images/logo1.png"
          alt="logo"
          className="w-48 h-25 object-contain"
        />
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Đặt lại mật khẩu của bạn
        </h2>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Nhập địa chỉ email đã đăng ký của bạn và chúng tôi sẽ gửi cho bạn
          hướng dẫn để đặt lại mật khẩu.
        </p>

        <div className="flex flex-col gap-4 w-full mb-6">
          <Input
            label="Email"
            type="email"
            color={true}
            placeholder={"Nhập email của bạn"}
          />
        </div>

        {/* Submit Button */}
        <Button
          label="Gửi liên kết đặt lại"
          onClick={() => navigate("/login")}
        />

        {/* Back to Login */}
        <p className="text-sm text-gray-600 mt-4">
          Ghi nhớ mật khẩu của bạn?{" "}
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

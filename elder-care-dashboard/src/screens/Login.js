import React, { useState } from "react";
import { Button, Input } from "../components/Form";
import { BiLogInCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({}); // Thêm state errors để lưu các lỗi

  const handleLogin = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!phone) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!password) newErrors.password = "Vui lòng nhập mật khẩu";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Lưu lỗi vào state
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        { phone, password }
      );

      const { token, user } = response.data;

      if (user.role !== "admin") {
        setErrors({ general: "Chỉ admin mới được phép đăng nhập!" });
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
    } catch (error) {
      // Xử lý lỗi khi server trả về thông báo "Số điện thoại này chưa được đăng ký"
      if (
        error.response?.data?.message === "Số điện thoại này chưa được đăng ký"
      ) {
        setErrors({ phone: "Số điện thoại này chưa được đăng ký" });
      } else {
        setErrors({
          general: error.response?.data?.message || "Đăng nhập thất bại!",
        });
      }
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
        <div className="flex flex-col gap-4 w-full mb-6">
          <div>
            <Input
              label="Số điện thoại"
              type="text"
              color={true}
              placeholder={"Nhập số điện thoại của bạn"}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <Input
              label="Mật khẩu"
              type="password"
              color={true}
              placeholder={"*********"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
        </div>

        {errors.general && (
          <p className="text-red-500 text-sm mb-4">{errors.general}</p>
        )}

        <Button label="Login" Icon={BiLogInCircle} onClick={handleLogin} />

        <div className="mt-4 text-sm text-gray-600 flex flex-col items-center">
          <p>
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={() => navigate("/forgotpassword")}
            >
              Quên mật khẩu?
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;

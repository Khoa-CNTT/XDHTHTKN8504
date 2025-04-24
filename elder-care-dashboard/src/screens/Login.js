import React, { useState } from "react";
import { Button, Input } from "../components/Form";
import { BiLogInCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      console.log("Đăng nhập với:", phone, password); // Kiểm tra xem có dữ liệu không

      const response = await axios.post("http://localhost:5000/api/v1/auth/login",
        { 
          phone, 
          password 
        }
      );

      const { token, user } = response.data;

      // Kiểm tra role
      if (user.role !== 'admin') {
        alert('Chỉ admin mới được phép đăng nhập!');
        return;
      }

      //Lưu token và cho vào trang admin
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate("/");
      console.log("Login response:", response.data);
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Đăng nhập thất bại!");
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
          <Input
            label="Số điện thoại"
            type="text"
            color={true}
            placeholder={"Nhập số điện thoại của bạn"}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            label="Mật khẩu"
            type="password"
            color={true}
            placeholder={"*********"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Button for Login */}
        <Button
          label="Login"
          Icon={BiLogInCircle}
          // onClick={() => navigate("/")}
          onClick={handleLogin}
        />

        {/* Links for Forgot Password and Register, centered */}
        <div className="mt-4 text-sm text-gray-600 flex flex-col items-center">
          <p>
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={() => navigate("/forgotpassword")}
            >
              Quên mật khẩu?
            </span>
          </p>
          {/* <p className="mt-2">
            Bạn chưa có tài khoản?{" "}
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={() => navigate("/register")}
            >
              Đăng ký tại đây
            </span>
          </p> */}
        </div>
      </form>
    </div>
  );
}

export default Login;

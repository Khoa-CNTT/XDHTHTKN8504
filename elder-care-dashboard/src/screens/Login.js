import React, { useState } from "react";
import { Button, Input } from "../components/Form";
import { BiLogInCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("family_member");
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Đăng nhập thành công!");
        // Nếu có token hoặc user info thì lưu lại ở localStorage:
        // localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        alert("Đăng nhập thất bại: " + data.message);
      }
    } catch (error) {
      alert("Lỗi kết nối server: " + error.message);
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
            label="Email"
            type="email"
            color={true}
            placeholder={"admin@gmail.com"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
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
          <p className="mt-2">
            Bạn chưa có tài khoản?{" "}
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={() => navigate("/register")}
            >
              Đăng ký tại đây
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;

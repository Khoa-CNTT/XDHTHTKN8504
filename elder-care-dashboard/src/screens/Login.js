import React from "react";
import { Button, Input } from "../components/Form";
import { BiLogInCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

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
          />
          <Input
            label="Password"
            type="password"
            color={true}
            placeholder={"*********"}
          />
        </div>

        {/* Button for Login */}
        <Button
          label="Login"
          Icon={BiLogInCircle}
          onClick={() => navigate("/")}
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

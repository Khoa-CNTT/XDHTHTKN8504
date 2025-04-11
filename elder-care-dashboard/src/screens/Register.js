import React, { useState } from "react";
import { Button, Input } from "../components/Form";
import { BiLogInCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Hàm xử lý thay đổi input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Hàm xử lý khi nhấn nút đăng ký
  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill in all fields!");
    } else if (password !== confirmPassword) {
      alert("Passwords do not match!");
    } else {
      alert("Registration Successful!");
      navigate("/"); // Điều hướng sau khi đăng ký thành công
    }
  };

  return (
    <div className="w-full h-screen flex-colo bg-greenok">
      <form
        onSubmit={handleSubmit}
        className="w-2/5 p-8 rounded-2xl mx-auto bg-white flex-colo"
      >
        <img
          src="/images/logo1.png"
          alt="logo"
          className="w-48 h-25 object-contain"
        />
        <div className="flex flex-col gap-4 w-full mb-6">
          <Input
            label="Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            color={true}
            placeholder="Your Name"
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            color={true}
            placeholder="admin@gmail.com"
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            color={true}
            placeholder="*********"
          />
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            color={true}
            placeholder="*********"
          />
        </div>
        <Button label="Register" Icon={BiLogInCircle} type="submit" />
      </form>
    </div>
  );
}

export default Register;

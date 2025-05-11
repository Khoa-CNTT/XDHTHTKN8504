import React, { useState } from "react";
import { MdOutlineCalculate } from "react-icons/md";
import { toast } from "react-hot-toast";
import Layout from "../../Layout";
import { Button } from "../../components/Form";

function NurseSalary() {
  const [form, setForm] = useState({
    nurseName: "",
    basicSalary: "",
    daysWorked: "",
    bonus: "",
    deductions: "",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculateSalary = () => {
    const { basicSalary, daysWorked, bonus, deductions } = form;

    const base = parseFloat(basicSalary) || 0;
    const days = parseInt(daysWorked) || 0;
    const add = parseFloat(bonus) || 0;
    const minus = parseFloat(deductions) || 0;

    const total = base * (days / 30) + add - minus;

    if (!form.nurseName || base <= 0 || days <= 0) {
      toast.error("Vui lòng nhập đầy đủ và hợp lệ!");
      return;
    }

    setResult(total.toFixed(2));
  };

  return (
    <Layout>
      <h1 className="text-xl font-semibold">Tính Lương Điều Dưỡng</h1>

      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        className="bg-white my-8 rounded-xl border border-border p-6 shadow-md"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            name="nurseName"
            placeholder="Tên điều dưỡng"
            value={form.nurseName}
            onChange={handleChange}
            className="h-14 w-full text-sm text-main rounded-md bg-dry border border-border px-4"
          />
          <input
            type="number"
            name="basicSalary"
            placeholder="Lương cơ bản (VNĐ)"
            value={form.basicSalary}
            onChange={handleChange}
            className="h-14 w-full text-sm text-main rounded-md bg-dry border border-border px-4"
          />
          <input
            type="number"
            name="daysWorked"
            placeholder="Số ngày làm việc"
            value={form.daysWorked}
            onChange={handleChange}
            className="h-14 w-full text-sm text-main rounded-md bg-dry border border-border px-4"
          />
          <input
            type="number"
            name="bonus"
            placeholder="Thưởng (nếu có)"
            value={form.bonus}
            onChange={handleChange}
            className="h-14 w-full text-sm text-main rounded-md bg-dry border border-border px-4"
          />
          <input
            type="number"
            name="deductions"
            placeholder="Khấu trừ (nếu có)"
            value={form.deductions}
            onChange={handleChange}
            className="h-14 w-full text-sm text-main rounded-md bg-dry border border-border px-4"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            label="Tính lương"
            Icon={MdOutlineCalculate}
            onClick={calculateSalary}
          />
        </div>

        {result && (
          <div className="mt-6 p-4 bg-blue-50 rounded-md border text-blue-700 font-medium">
            Tổng lương của <span className="font-bold">{form.nurseName}</span>{" "}
            là: <span className="text-lg">{result} VNĐ</span>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default NurseSalary;

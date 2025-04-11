import React from "react";
import { sortsDatas } from "../../components/Datas";
import { Button, Input, Select, Textarea } from "../../components/Form";
import { BiChevronDown } from "react-icons/bi";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { toast } from "react-hot-toast";

// Thông Tin Sức Khỏe
// Dị ứng
// Thói quen
// Tiền sử bệnh lý

function HealthInfomation() {
  const [bloodType, setBloodType] = React.useState(
    sortsDatas.bloodTypeFilter[0]
  );
  return (
    <div className="flex-colo gap-4">
      {/* Tải lên thông tin */}
      <div className="flex gap-3 flex-col w-full col-span-6">
        {/* Nhóm máu */}
        <div className="flex w-full flex-col gap-3">
          <p className="text-black text-sm">Nhóm máu</p>
          <Select
            selectedPerson={bloodType}
            setSelectedPerson={setBloodType}
            datas={sortsDatas.bloodTypeFilter}
          >
            <div className="w-full flex-btn text-textGray text-sm p-4 border border-border font-light rounded-lg focus:border focus:border-subMain">
              {bloodType?.name} <BiChevronDown className="text-xl" />
            </div>
          </Select>
        </div>

        {/* Cân nặng */}
        <Input label="Cân nặng" color={true} type="text" placeholder={"60kg"} />
        {/* Chiều cao */}
        <Input label="Chiều cao" color={true} type="text" placeholder={"1m7"} />
        {/* Dị ứng */}
        <Textarea
          label="Dị ứng"
          color={true}
          rows={3}
          placeholder={"đậu, hạt, v.v."}
        />
        {/* Thói quen */}
        <Textarea
          label="Thói quen"
          color={true}
          rows={3}
          placeholder={"hút thuốc, uống rượu, v.v."}
        />
        {/* Tiền sử bệnh lý */}
        <Textarea
          label="Tiền sử bệnh lý"
          color={true}
          rows={3}
          placeholder={"tiểu đường, sốt rét, tăng nhãn áp, v.v."}
        />

        {/* Nút lưu */}
        <Button
          label={"Lưu thay đổi"}
          Icon={HiOutlineCheckCircle}
          onClick={() => {
            toast.error("Tính năng này chưa khả dụng");
          }}
        />
      </div>
    </div>
  );
}

export default HealthInfomation;

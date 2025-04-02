import React from "react";
import Uploder from "../Uploader";
import { sortsDatas } from "../Datas";
import { Button, DatePickerComp, Input, Select } from "../Form";
import { BiChevronDown } from "react-icons/bi";
import { toast } from "react-hot-toast";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { RiDeleteBin5Line } from "react-icons/ri";

function PersonalInfo({ titles }) {
  const [title, setTitle] = React.useState(sortsDatas.title[0]);
  const [date, setDate] = React.useState(new Date());
  const [gender, setGender] = React.useState(sortsDatas.genderFilter[0]);

  return (
    <div className="flex-colo gap-4">
      {/* uploader */}
      <div className="flex gap-3 flex-col w-full col-span-6">
        <p className="text-sm">Ảnh hồ sơ</p>
        <Uploder />
      </div>

      {/* select */}
      {titles && (
        <div className="flex w-full flex-col gap-3">
          <p className="text-black text-sm">Chức danh</p>
          <Select
            selectedPerson={title}
            setSelectedPerson={setTitle}
            datas={sortsDatas.title}
          >
            <div className="w-full flex-btn text-textGray text-sm p-4 border border-border font-light rounded-lg focus:border focus:border-subMain">
              {title?.name} <BiChevronDown className="text-xl" />
            </div>
          </Select>
        </div>
      )}

      {/* fullName */}
      <Input label="Họ và tên" color={true} type="text" />
      {/* phone */}
      <Input label="Số điện thoại" color={true} type="number" />
      {/* email */}
      <Input label="Email" color={true} type="email" />
      {!titles && (
        <>
          {/* gender */}
          <div className="flex w-full flex-col gap-3">
            <p className="text-black text-sm">Giới tính</p>
            <Select
              selectedPerson={gender}
              setSelectedPerson={setGender}
              datas={sortsDatas.genderFilter}
            >
              <div className="w-full flex-btn text-textGray text-sm p-4 border border-border font-light rounded-lg focus:border focus:border-subMain">
                {gender?.name} <BiChevronDown className="text-xl" />
              </div>
            </Select>
          </div>

          {/* emergency contact */}
          <Input label="Liên hệ khẩn cấp" color={true} type="number" />

          {/* date */}
          <DatePickerComp
            label="Ngày sinh"
            startDate={date}
            onChange={(date) => setDate(date)}
          />

          {/* address */}
          <Input label="Địa chỉ" color={true} type="text" />
        </>
      )}

      {/* submit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <Button
          label={"Xóa tài khoản"}
          Icon={RiDeleteBin5Line}
          onClick={() => {
            toast.error("Chức năng này hiện chưa khả dụng");
          }}
        />
        <Button
          label={"Lưu thay đổi"}
          Icon={HiOutlineCheckCircle}
          onClick={() => {
            toast.error("Chức năng này hiện chưa khả dụng");
          }}
        />
      </div>
    </div>
  );
}

export default PersonalInfo;

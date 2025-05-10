import React, { useState } from "react";
import Modal from "./Modal";
import { Button, Input, Select } from "../Form";
import { BiChevronDown } from "react-icons/bi";
import { sortsDatas } from "../Datas";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { toast } from "react-hot-toast";
import Access from "../Access";
import Uploader from "../Uploader";

function AddUserStaffModal({ closeModal, isOpen, doctor, datas }) {
  const [instraction, setInstraction] = useState(sortsDatas.title[0]);
  const [access, setAccess] = useState({});
  const [role, setRole] = useState("");
  const color = true;

  const onSubmit = () => {
    toast.error("This feature is not available yet");
  };

  return (
    <Modal
      closeModal={closeModal}
      isOpen={isOpen}
      title={doctor ? "Add Doctor" : datas?.id ? "Edit Stuff" : "Add Stuff"}
      width={"max-w-3xl"}
    >
      <div className="flex gap-3 flex-col col-span-6 mb-6">
        <p className="text-sm">Profile Image</p>
        <Uploader />
      </div>

      <div className="flex-colo gap-6">
        <div className="grid sm:grid-cols-1 gap-4 w-full">
          <Input label="Số điện thoại" color={true} />
        </div>
        {/* password */}
        <Input label="Mật khẩu" color={true} />
        <Input label="Xác nhận mật khẩu" color={true} />

        <div className="grid sm:grid-cols-1 gap-4 w-full">
          <div className="flex flex-col gap-2 w-full">
            <label className="text-sm font-medium text-gray-700">Vai trò</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`w-full bg-transparent text-sm mt-3 p-4 border ${
                color ? "border-border font-light" : "border-white text-white"
              } rounded-lg focus:border focus:border-subMain`}
            >
              <option
                value=""
                className="p-4 text-sm font-light bg-white text-black"
              >
                -- Chọn vai trò --
              </option>
              <option
                value="doctor"
                className="p-4 text-sm font-light bg-white text-black"
              >
                Bác sĩ
              </option>
              <option
                value="nurse"
                className="p-4 text-sm font-light bg-white text-black"
              >
                Điều dưỡng
              </option>
            </select>
          </div>
        </div>

        {/* buttones */}
        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <button
            onClick={closeModal}
            className="bg-red-600 bg-opacity-5 text-red-600 text-sm p-4 rounded-lg font-light"
          >
            Cancel
          </button>
          <Button label="Save" Icon={HiOutlineCheckCircle} onClick={onSubmit} />
        </div>
      </div>
    </Modal>
  );
}

export default AddUserStaffModal;

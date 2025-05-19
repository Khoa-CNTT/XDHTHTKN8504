import React, { useState } from "react";
import Modal from "./Modal";
import { Button, Input } from "../Form";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useEffect } from "react";

function AddEditStaffModal({ onClose, isOpen, doctor, id, datas }) {
    const isDoctor = datas?.type === "doctor";
    const isNurse = datas?.type === "nurse";
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [specialization, setSpecialization] = useState(""); // cho bác sĩ
    const [specialties, setSpecialties] = useState(""); // cho điều dưỡng
    const [licenseNumber, setLicenseNumber] = useState("");
    const [experience, setExperience] = useState("");

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (datas) {
            setFirstName(datas.firstName || "");
            setLastName(datas.lastName || "");
            setEmail(datas.email || "");
            setLicenseNumber(datas.licenseNumber || "")
            if (isDoctor) {
                setSpecialization(datas.specialization || "");
                setExperience(datas.experience || "");
            } else if (isNurse) {
                setSpecialties(datas.specialties || "");
            }
        }
    }, [datas]);

    // console.log("datas", datas);
    // console.log("Đang cập nhật", isDoctor ? "Doctor" : "Nurse");
    // console.log("ID:", datas._id);

    const onSubmit = async () => {
        const newErrors = {};

        // Validate chung
        if (!firstName) newErrors.firstName = "Họ không được để trống";
        if (!lastName) newErrors.lastName = "Tên không được để trống";
        if (!email) newErrors.email = "Email không được để trống";
        if (!licenseNumber) newErrors.licenseNumber = "Số giấy phép không được để trống";

        // Validate riêng theo loại
        if (isDoctor) {
            if (!specialization) newErrors.specialization = "Chuyên khoa không được để trống";
            if (!experience) newErrors.experience = "Kinh nghiệm không được để trống";
        }

        if (isNurse) {
            if (!specialties) newErrors.specialties = "Chuyên môn không được để trống";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        try {
            // console.log("doctor", isDoctor);
            if (isDoctor) {
                let response;
                const payload = {
                    firstName,
                    lastName,
                    email,
                    licenseNumber,
                    specialization,
                    experience,
                };
                response = await axios.put(`http://localhost:5000/api/v1/doctors/update/${datas._id}`, payload);
            } else if (isNurse) {
                let response;
                const payload = {
                    firstName,
                    lastName,
                    email,
                    licenseNumber,
                    specialties,
                };
                response = await axios.put(`http://localhost:5000/api/v1/nurses/update/${datas._id}`, payload);
            }

            toast.success("Cập nhật thành công!");
            onClose();
        } catch (error) {
            console.error("❌ Lỗi cập nhật:", error);
            toast.error("Cập nhật thất bại!");
        }
    };

    return (
        <Modal
            closeModal={onClose}
            isOpen={isOpen}
            // title={isDoctor ? "Thêm Bác sĩ" : "Thêm Điều dưỡng"}
            title={"Cập nhật nhân viên"}
            width={"max-w-3xl"}
        >
            <div className="flex-colo gap-6">
                <div className="grid sm:grid-cols-2 gap-4 w-full">
                    <div>
                        <Input
                            label="Họ"
                            color={true}
                            placeholder="Họ"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        {errors.firstName && (
                            <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
                        )}{" "}
                        {/* Thông báo lỗi */}
                    </div>
                    <div>
                        <Input
                            label="Tên"
                            color={true}
                            placeholder="Tên"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        {errors.lastName && (
                            <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
                        )}{" "}
                        {/* Thông báo lỗi */}
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 w-full">
                    <div>
                        <Input
                            type="email"
                            label="Email"
                            color={true}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                        )}{" "}
                        {/* Thông báo lỗi */}
                    </div>
                    {isDoctor && (
                        <>
                            <Input
                                label="Chuyên môn"
                                color={true}
                                value={specialization}
                                onChange={(e) => setSpecialization(e.target.value)}
                            />
                            {errors.specialization && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.specialization}
                                </p>
                            )}{" "}
                        </>
                    )}

                    {isNurse && (
                        <>
                            <Input
                                label="Chuyên ngành"
                                color={true}
                                value={specialties}
                                onChange={(e) => setSpecialties(e.target.value)}
                            />
                            {errors.specialties && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.specialties}
                                </p>
                            )}{" "}
                        </>
                    )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4 w-full">
                    <div>
                        <Input
                            label="Số giấy phép"
                            color={true}
                            value={licenseNumber}
                            onChange={(e) => setLicenseNumber(e.target.value)}
                        />
                        {errors.licenseNumber && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.licenseNumber}
                            </p>
                        )}{" "}
                        {/* Thông báo lỗi */}
                    </div>
                    {isDoctor && (
                        <div>
                            <Input
                                label="Số năm làm nghề"
                                color={true}
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                {/* buttons */}
                <div className="grid sm:grid-cols-2 gap-4 w-full">
                    <button
                        onClick={onClose}
                        className="bg-red-600 bg-opacity-5 text-red-600 text-sm p-4 rounded-lg font-light"
                    >
                        Thoát
                    </button>
                    <Button label="Cập nhật" Icon={HiOutlineCheckCircle} onClick={onSubmit} />
                </div>
            </div>
        </Modal>
    );
}

export default AddEditStaffModal;

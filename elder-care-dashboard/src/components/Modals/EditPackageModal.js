import React, { useState, useEffect } from 'react';
import Modal from "./Modal";
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, Switchi, Textarea } from "../Form";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { toast } from "react-hot-toast";
import { fetchServices } from "../../store/serviceSlice";

const EditPackageModal = ({ isOpen, onClose, onSave, initialData }) => {
    const dispatch = useDispatch();
    const { services } = useSelector((state) => state.service);

    const [image, setImage] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [percentage, setPercentage] = useState("");
    const [role, setRole] = useState("");
    const [description, setDescription] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [serviceId, setServiceId] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        dispatch(fetchServices());
    }, [dispatch]);

    useEffect(() => {
        if (initialData) {
            setImage(initialData.image || "");
            setName(initialData.name || "");
            setPrice(initialData.price || "");
            setPercentage(initialData.percentage || "");
            setRole(initialData.role || "");
            setDescription(initialData.description || "");
            setIsActive(initialData.isActive || false);
            setServiceId(initialData.serviceId || "");
        }
    }, [initialData]);

    const validate = () => {
        const newErrors = {};
        if (!name) newErrors.name = "Vui lòng nhập tên dịch vụ";
        if (!price) newErrors.price = "Vui lòng nhập giá";
        if (!percentage) newErrors.percentage = "Vui lòng nhập phần trăm";
        if (!role) newErrors.role = "Vui lòng chọn vai trò";
        if (!serviceId) newErrors.serviceId = "Vui lòng chọn dịch vụ liên quan";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        const updatedData = {
            name,
            price,
            percentage,
            role,
            description,
            isActive,
            image,
            serviceId,
        };

        onSave(updatedData);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Chỉnh sửa gói dịch vụ">
            <div className="flex-colo gap-6 p-4">
                <div className="w-full">
                    <Input
                        label="Tên dịch vụ"
                        color={true}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nhập tên dịch vụ"
                    />
                    {errors.name && (
                        <p className="text-sm text-red-500 mt-1 ml-1">{errors.name}</p>
                    )}
                </div>

                <div className="w-full grid sm:grid-cols-2 gap-4">
                    <div className="w-full">
                        <Input
                            label="Giá (vnd)"
                            type="number"
                            min="0"
                            color={true}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                        {errors.price && (
                            <p className="text-sm text-red-500 mt-1 ml-1">{errors.price}</p>
                        )}
                    </div>

                    <div className="w-full">
                        <Input
                            label="Tỉ lệ phần trăm (%)"
                            type="number"
                            color={true}
                            value={percentage}
                            onChange={(e) => setPercentage(e.target.value)}
                        />
                        {errors.percentage && (
                            <p className="text-sm text-red-500 mt-1 ml-1">
                                {errors.percentage}
                            </p>
                        )}
                    </div>
                </div>

                <div className="w-full">
                    <label className="text-sm block mb-2">Vai trò</label>
                    <select
                        className="w-full p-3 border border-border rounded-md bg-teal-100 text-sm"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="">-- Chọn vai trò --</option>
                        <option value="doctor">Bác sĩ</option>
                        <option value="nurse">Điều dưỡng</option>
                    </select>
                    {errors.role && (
                        <p className="text-sm text-red-500 mt-1 ml-1">{errors.role}</p>
                    )}
                </div>

                <div className="w-full">
                    <label className="text-sm block mb-2">Dịch vụ liên quan</label>
                    <select
                        className="w-full p-3 border border-border rounded-md bg-dry text-sm"
                        value={serviceId}
                        onChange={(e) => setServiceId(e.target.value)}
                    >
                        <option value="">-- Chọn dịch vụ --</option>
                        {services?.map((s) => (
                            <option key={s._id} value={s._id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                    {errors.serviceId && (
                        <p className="text-sm text-red-500 mt-1 ml-1">{errors.serviceId}</p>
                    )}
                </div>

                <Textarea
                    label="Mô tả"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Nhập mô tả"
                />

                <div className="flex items-center gap-2 w-full">
                    <Switchi checked={isActive} onChange={() => setIsActive(!isActive)} />
                    <p
                        className={`text-sm ${isActive ? "text-subMain" : "text-textGray"}`}
                    >
                        {isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 w-full">
                    <button
                        onClick={onClose}
                        className="bg-red-600 bg-opacity-5 text-red-600 text-sm p-4 rounded-lg font-light"
                    >
                        Hủy
                    </button>
                    <Button
                        label="Lưu"
                        Icon={HiOutlineCheckCircle}
                        onClick={handleSubmit}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default EditPackageModal;

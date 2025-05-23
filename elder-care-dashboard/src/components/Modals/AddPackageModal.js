import React, { useState } from "react";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { Button, Input, Switchi, Textarea } from "../Form";

const AddPackageModal = ({ isOpen, onClose, onSubmit, services }) => {
    const [form, setForm] = useState({
        serviceId: "",
        name: "",
        description: "",
        price: "",
        totalDays: "",
        repeatInterval: "",
        timeWork: "",
        discount: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        const newErrors = {};
        if (!form.serviceId) newErrors.serviceId = "Vui lòng chọn dịch vụ";
        if (!form.name) newErrors.name = "Nhập tên gói";
        if (!form.price) newErrors.price = "Nhập giá";
        if (!form.totalDays) newErrors.totalDays = "Nhập số ngày";
        if (!form.timeWork) newErrors.timeWork = "Nhập thời gian làm việc";
        if (!form.description) newErrors.description = "Nhập mô tả";

        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            onSubmit(form);
            onClose();
        }
    };

    if (!isOpen) return null;

    // console.log(form);
    

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
            <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 space-y-5 relative">
                <h2 className="text-lg font-semibold text-subMain">Thêm Gói Dịch Vụ</h2>

                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="w-full">
                        <label className="text-sm block mb-2">Dịch vụ</label>
                        <select
                            name="serviceId"
                            value={form.serviceId}
                            onChange={handleChange}
                            className="w-full p-3 border border-border rounded-md bg-dry text-sm"
                        >
                            <option value="">-- Chọn dịch vụ --</option>
                            {services.map((s) => (
                                <option key={s._id} value={s._id}>
                                    {s.name}
                                </option>
                            ))}
                        </select>
                        {errors.serviceId && (
                            <p className="text-sm text-red-500 mt-1">{errors.serviceId}</p>
                        )}
                    </div>

                    <Input
                        label="Tên gói"
                        name="name"
                        type="text"
                        color={true}
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Nhập tên gói"
                    />
                </div>

                <Textarea
                    label="Mô tả"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Nhập mô tả gói"
                />
                {errors.description && (
                    <p className="text-sm text-red-500 ml-1">{errors.description}</p>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                        label="Giá (VNĐ)"
                        name="price"
                        type="number"
                        color={true}
                        value={form.price}
                        onChange={handleChange}
                        placeholder="6000000"
                    />
                    <Input
                        label="Số ngày"
                        name="totalDays"
                        type="number"
                        color={true}
                        value={form.totalDays}
                        onChange={handleChange}
                        placeholder="30"
                    />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                        label="Tần suất lặp (ngày)"
                        name="repeatInterval"
                        type="number"
                        color={true}
                        value={form.repeatInterval}
                        onChange={handleChange}
                        placeholder="2"
                    />
                    <Input
                        label="Thời gian làm (giờ)"
                        name="timeWork"
                        type="number"
                        color={true}
                        value={form.timeWork}
                        onChange={handleChange}
                        placeholder="2"
                    />
                </div>

                <Input
                    label="Giảm giá (%)"
                    name="discount"
                    type="number"
                    color={true}
                    value={form.discount}
                    onChange={handleChange}
                    placeholder="15"
                />

                <div className="grid sm:grid-cols-2 gap-4 pt-4">
                    <button
                        onClick={onClose}
                        className="bg-red-600 bg-opacity-10 text-red-600 text-sm p-4 rounded-lg font-light"
                    >
                        Huỷ
                    </button>
                    <Button
                        label="Lưu"
                        Icon={HiOutlineCheckCircle}
                        onClick={handleSave}
                    />
                </div>
            </div>
        </div>
    );
};

export default AddPackageModal;

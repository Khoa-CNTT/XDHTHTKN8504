import React, { useEffect, useState } from 'react'
import Layout from '../Layout'
import { PackageTable } from '../components/Tables';
import { BiChevronDown, BiPlus } from "react-icons/bi";
import { getAllPackagesByAdmin } from '../store/packageSlice';
import { useDispatch, useSelector } from 'react-redux';
import EditPackageModal from '../components/Modals/EditPackageModal';
import { createPackage, deletePackage } from '../store/packageSlice'
import AddPackageModal from '../components/Modals/AddPackageModal';
import { fetchServices } from "../store/serviceSlice";

const Packages = () => {
    const { packages, loading, error } = useSelector((state) => state.package)
    const { services } = useSelector((state) => state.service);
    const dispatch = useDispatch();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [isOpenAdd, setIsOpenAdd] = useState(false);

    const handleAddPackage = (data) => {
        dispatch(createPackage(data));
    };

    useEffect(() => {
        dispatch(getAllPackagesByAdmin());
        dispatch(fetchServices())
    }, [dispatch])

    const handleEdit = (pkg) => {
        setSelectedPackage(pkg);
        setIsModalOpen(true);
    };

    const handleSave = async (updatedData) => {
        if (!selectedPackage) return;

        await fetch(`/api/v1/packages/${selectedPackage._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        setIsModalOpen(false);
        setSelectedPackage(null);
        dispatch(getAllPackagesByAdmin());
    };

    const handleDelete = (id) => {
        if (!id) {
            console.error("Không tìm thấy ID để xoá.");
            return;
        }

        const confirm = window.confirm("Bạn có chắc muốn xoá gói này?");
        if (confirm) {
            dispatch(deletePackage(id));
        }
    };

    return (
        <Layout>
            <AddPackageModal
                isOpen={isOpenAdd}
                onClose={() => setIsOpenAdd(false)}
                onSubmit={handleAddPackage}
                services={services}
            />
            <button
                onClick={() => setIsOpenAdd(true)}
                className="w-16 animate-bounce h-16 border border-border z-50 bg-subMain text-white rounded-full flex-colo fixed bottom-8 right-12 button-fb"
            >
                <BiPlus className="text-2xl" />
            </button>
            <h1 className="text-xl font-semibold">Packages</h1>
            <div
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="100"
                data-aos-offset="200"
                className="bg-white my-8 rounded-xl border-[1px] border-border p-5"
            >
                <div className="grid md:grid-cols-6 grid-cols-1 gap-2">
                    <div className="md:col-span-5 grid lg:grid-cols-4 xs:grid-cols-2 items-center gap-2">
                        <input
                            type="text"
                            placeholder='Search "teeth cleaning"'
                            className="h-14 w-full text-sm text-main rounded-md bg-dry border border-border px-4"
                        />

                    </div>
                </div>
                <div className="mt-8 w-full overflow-x-scroll">
                    <PackageTable
                        data={packages}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            </div>

            {/* 🧩 Gọi modal chỉnh sửa */}
            <EditPackageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={selectedPackage}
            />
        </Layout>
    )
}

export default Packages

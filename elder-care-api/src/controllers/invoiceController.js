import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Nurse from "../models/Nurse.js";
import Invoice from "../models/Invoice.js";
import paginate from "../utils/pagination.js";

const invoiceController = {
    getInvoice: async (req, res) => {
        try {
            // Lấy page và limit từ query, mặc định page=1, limit=10
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            // Đếm tổng số Invoice
            const total = await Invoice.countDocuments();

            // Lấy dữ liệu có phân trang và populate
            const invoices = await Invoice.find()
                .populate({
                    path: 'bookingId',
                    populate: {
                        path: 'profileId',
                        model: 'Profile'
                    }
                })
                .sort({ createdAt: -1 }) // Có thể sắp xếp nếu muốn
                .skip(skip)
                .limit(limit);

            // Trả về dữ liệu cùng thông tin phân trang
            return res.status(200).json({
                invoices,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            });
        } catch (error) {
            res.status(500).json({ message: "Error fetching invoices", error: error.message });
        }
    },

    getInvoiceDetail: async (req, res) => {
        try {
            const { id } = req.params;
            // controllers/invoice.controller.js
            const invoice = await Invoice.findById(req.params.id)
                .populate({
                    path: "bookingId",
                    populate: [
                        { path: "profileId" },
                        { path: "participants" },
                        { path: "serviceId" } // Thêm dòng này
                    ]
                });


            if (!invoice) {
                return res.status(404).json({ message: "Invoice not found" });
            }

            return res.status(200).json(invoice);
        } catch (error) {
            res.status(500).json({ message: "Error fetching invoice detail", error: error.message });
        }
    },

    getInvoiceForStaff: async (req, res) => {
        try {
            const { _id } = req.params;

            let staff = await Doctor.findById(_id);

            if (!staff) {
                staff = await Nurse.findById(_id);
            }

            if (!staff) {
                return res.status(404).json({ message: "Không tìm thấy nhân viên!" });
            }

            const staffId = staff.userId;
            if (!staffId) {
                return res.status(400).json({ message: "Nhân viên không có staffId!" });
            }

            const invoices = await Invoice.find({ staffId })
                .populate({
                    path: 'bookingId',
                    populate: [
                        { path: 'profileId' },
                        { path: 'participants' },
                        { path: 'serviceId' }
                    ]
                })
                .sort({ createdAt: -1 });

            return res.status(200).json({ invoices });
        } catch (error) {
            return res.status(500).json({
                message: "Error fetching staff invoices",
                error: error.message
            });
        }
    },
}

export default invoiceController;
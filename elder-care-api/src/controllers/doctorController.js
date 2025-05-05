import Doctor from "../models/Doctor.js"
import User from "../models/User.js";

const docterController = {
    // create docter
    createDoctor: async (req, res) => {
        try {
            const { userId, firstName, lastName, email, specialization, licenseNumber, experience, isAvailable } = req.body

            const existingDoctor = await Doctor.findOne({ userId })
            if (existingDoctor) {
                return res.status(400).json({
                    message: "Tài khoản này đã là bác sĩ",
                })
            }

            const newDoctor = new Doctor({
                userId,
                firstName,
                lastName,
                email,
                specialization,
                licenseNumber,
                experience,
                isAvailable
            })

            const user = await User.findById(userId)
            if (user) {
                user.role = "doctor"
                await user.save()
            }

            await newDoctor.save()
            return res.status(201).json({
                message: "Tạo bác sĩ thành công",
                doctor: newDoctor,
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
                error: error.message,
            })
        }
    },

    getAllDoctor: async (req, res) => {
        try {
            const { _id: adminId } = req.user;

            const doctors = await Doctor.find()
                .populate('userId')
                .sort({ createdAt: -1 })
                
            return res.status(200).json({
                message: "Lấy danh sách bác sĩ thành công",
                doctors: doctors,
            })
        } catch (error) {
            console.error("Lỗi:", error);
            return res.status(500).json({
                message: "Lỗi server",
                error: error.message
            });
        }
    }
}

export default docterController
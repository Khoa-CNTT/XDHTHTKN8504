import Doctor from "../models/Doctor.js"
import User from "../models/User.js";

import Salary from "../models/Salary.js";


const docterController = {
    // create docter
    createDoctor: async (req, res) => {
        try {
            const { userId, firstName, lastName, email, specialization, licenseNumber, experience, isAvailable, percentage } = req.body


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


            const newSalary = new Salary({
                staffId: newDoctor._id,
                role: "doctor",
                percentage,
            })

            await newSalary.save()
            return res.status(201).json({
                message: "Tạo bác sĩ thành công",
                doctor: newDoctor,
                Salary: newSalary,

            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
                error: error.message,
            })
        }
    }
}

export default docterController
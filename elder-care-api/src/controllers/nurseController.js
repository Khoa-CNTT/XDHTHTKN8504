import Nurse from "../models/Nurse.js";
import User from "../models/User.js";
import { getIO } from "../config/socketConfig.js";

const nurseController = {
    // Create a new nurse
    createNurse: async (req, res) => {
        const io = getIO();
        try {
            const { userId, firstName, lastName, email, specialization, licenseNumber, experience, isAvailable } = req.body;

            const existingNurse = await Nurse.findOne({ userId });
            if (existingNurse) {
                return res.status(400).json({
                    message: "This account is already a nurse",
                });
            }

            const newNurse = new Nurse({
                userId,
                firstName,
                lastName,
                email,
                specialization,
                licenseNumber,
            });

            const user = await User.findById(userId);
            if (user) {
                user.role = "nurse";
                await user.save();
            }

            await newNurse.save();

            // Emit event to socket.io
            io.to('staff_admin').emit('newStaffCreated', newNurse);

            return res.status(201).json({
                message: "Successfully created nurse",
                nurse: newNurse,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    },

    getAllNurse: async (req, res) => {
        try {
            const { _id: adminId } = req.user;

            const nurses = await Nurse.find()
                .populate('userId', 'phone role')
                .sort({ createdAt: -1 });

            res.status(200).json({ nurses });
        } catch (error) {
            return res.status(500).json({
                message: "Loi server",
                error: error.message
            })
        }
    }
}

export default nurseController;
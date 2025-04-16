import Nurse from "../models/Nurse.js";
import User from "../models/User.js";

const nurseController = {
    // Create a new nurse
    createNurse: async (req, res) => {
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
}

export default nurseController;
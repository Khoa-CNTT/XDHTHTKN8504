import Profiles from "../models/Profile.js";
import User from "../models/User.js";

const profileController = {
    // Create a new profile
    createProfile: async (req, res) => {
        try {
            const { userId, firstName, lastName, relationship, address, emergencyContact, healthConditions, preferences } = req.body;

            // Check if the userId is provided
            const existingUser = await User.findById(userId)
            if(!existingUser) {
                return res.status(400).json({
                    message: "Tài khoản không tồn tại!",
                })
            }

            const newProfile = new Profiles({
                userId,
                firstName,
                lastName,
                relationship,
                address,
                emergencyContact,
                healthConditions,
                // preferences
            })

            await newProfile.save();
            return res.status(201).json({
                message: "Thêm mới hồ sơ thành công!",
                profile: newProfile,
            })
        } catch (error) {
            res.status(500).json({
                message: "Error ceating profile",
                error: error.message
            })
        }
    }
};

export default profileController;
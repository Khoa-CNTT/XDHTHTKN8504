import Profiles from "../models/Profile.js";
import User from "../models/User.js";

const profileController = {
    // Create a new profile
    createProfile: async (req, res) => {
        try {
            const { userId, firstName, lastName, relationship, address, emergencyContact, healthConditions, preferences } = req.body;

            // Check if the userId is provided
            const existingUser = await User.findById(userId)
            if (!existingUser) {
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
    },

    getUserProfiles: async (req, res) => {
        try {
            console.log("req.user:", req.user);
            const userId = req.user._id;

            const profiles = await Profiles.find({ userId: userId }).select("-__v"); // (optional) bỏ __v cho sạch

            return res.status(200).json({
                success: true,
                profile: profiles,
            });

        } catch (error) {
            console.error("Error in getUserProfiles:", error);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    },
};

export default profileController;
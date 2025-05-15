import Profiles from "../models/Profile.js";
import User from "../models/User.js";

const profileController = {
    // Create a new profile
    // createProfile: async (req, res) => {
    //     try {
    //         console.log("req.user:", req.user);
    //         const userId = req.user._id;
    //         const {firstName, lastName, birthDate, sex, relationship, address, phone, healthInfo, notes } = req.body;

    //         // Check if the userId is provided
    //         const existingUser = await User.findById(userId)
    //         if (!existingUser) {
    //             return res.status(400).json({
    //                 message: "Tài khoản không tồn tại!",
    //             })
    //         }

    //         const newProfile = new Profiles({
    //             // thêm avatar nếu cần
    //             userId,
    //             firstName,
    //             lastName,
    //             birthDate,
    //             sex,
    //             relationship,
    //             address,
    //             phone,
    //             healthInfo,
    //             notes
    //         })

    //         await newProfile.save();

    //         await User.findByIdAndUpdate(userId, { $push: { profiles: newProfile._id } }, { new: true });

    //         return res.status(201).json({
    //             message: "Thêm mới hồ sơ thành công!",
    //             profile: newProfile,
    //         })
    //     } catch (error) {
    //         res.status(500).json({
    //             message: "Error ceating profile",
    //             error: error.message
    //         })
    //     }
    // },
    createProfile: async (req, res) => {
        try {
          const userId = req.user._id;
          const { firstName, lastName, birthDate, sex, relationship, address, phone, healthInfo, notes } = req.body;

          const parsedBirthDate = new Date(birthDate);
          if (isNaN(parsedBirthDate.getTime())) {
            return res
              .status(400)
              .json({ message: "Invalid birthDate format." });
          }
      
          const existingUser = await User.findById(userId);
          if (!existingUser) {
            return res.status(400).json({ message: "Tài khoản không tồn tại!" });
          }
      
          const newProfile = new Profiles({
            userId,
            firstName,
            lastName,
            birthDate: parsedBirthDate,
            sex,
            relationship,
            address,
            phone,
            healthInfo,
            notes,
          });
      
          await newProfile.save();
      
          await User.findByIdAndUpdate(userId, { $push: { profiles: newProfile._id } }, { new: true });
      
          return res.status(201).json({
            message: "Thêm mới hồ sơ thành công!",
            profile: newProfile,
          });
        } catch (error) {
          console.error("Error in createProfile:", error);  // <-- Bổ sung log này
          res.status(500).json({
            message: "Error creating profile",
            error: error.message,
            stack: error.stack,  // có thể thêm để debug
          });
        }
      },
    getUserProfiles: async (req, res) => {
        try {

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

    updateProfile: async (req, res) => {
        try {
            const { profileId } = req.params;
            const updates = req.body;

            const updatedProfile = await Profiles.findByIdAndUpdate(
                profileId,
                updates,
                { new: true, runValidators: true }
            );

            if (!updatedProfile) {
                return res.status(404).json({ message: "Hồ sơ không tồn tại!" });
            }

            return res.status(200).json({
                message: "Cập nhật hồ sơ thành công!",
                profile: updatedProfile,
            });
        } catch (error) {
            console.error("Error in updateProfile:", error);
            return res.status(500).json({ message: "Server error" });
        }
    },

    deleteProfile: async (req, res) => {
        try {
            const { profileId } = req.params;

            const deletedProfile = await Profiles.findByIdAndDelete(profileId);

            if (!deletedProfile) {
                return res.status(404).json({ message: "Hồ sơ không tồn tại!" });
            }

            return res.status(200).json({
                message: "Xóa hồ sơ thành công!",
                profile: deletedProfile,
            });
        } catch (error) {
            console.error("Error in deleteProfile:", error);
            return res.status(500).json({ message: "Server error" });
        }
    },
};

export default profileController;
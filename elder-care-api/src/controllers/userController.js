import Doctor from "../models/Doctor.js";
import Nurse from "../models/Nurse.js";

const updateAvailabilityStatus = async (req, res) => {
  try {
    const { _id } = req.user;
    const userId = _id.toString(); // đảm bảo là string
    const { isAvailable } = req.body;

    let updated = null;

    const isDoctor = await Doctor.findOne({ userId });
    if (isDoctor) {
      updated = await Doctor.findOneAndUpdate(
        { userId },
        { isAvailable },
        { new: true }
      );
    } else {
      const isNurse = await Nurse.findOne({ userId });
      if (isNurse) {
        updated = await Nurse.findOneAndUpdate(
          { userId },
          { isAvailable },
          { new: true }
        );
      }
    }

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy điều dưỡng hoặc bác sĩ tương ứng" });
    }

    res.status(200).json({
      message: "Cập nhật trạng thái isAvailable thành công",
      data: updated,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật isAvailable:", error);
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

export default {updateAvailabilityStatus};
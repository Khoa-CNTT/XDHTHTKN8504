import dotenv from "dotenv";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Nurse from "../models/Nurse.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import { getIO } from "../config/socketConfig.js";
import moment from 'moment';

dotenv.config();

const authController = {
  // Đăng ký tài khoản mới
  registerUser: async (req, res) => {
    const io = getIO();
    try {
      const { phone, password, role, avatar } = req.body;

      // Kiểm tra dữ liệu bắt buộc
      if (!phone || !password || !role) {
        return res
          .status(400)
          .json({ message: "Vui lòng điền đủ phone, password và role" });
      }

      // Kiểm tra định dạng số điện thoại
      const phoneRegex = /^(0|\+84)\d{9,10}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: "Số điện thoại không hợp lệ" });
      }

      // Kiểm tra role hợp lệ
      const validRoles = ["family_member", "nurse", "admin", "doctor"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: "Role không hợp lệ" });
      }

      // Kiểm tra trùng số điện thoại
      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Số điện thoại đã được sử dụng" });
      }

      // Mã hóa mật khẩu
      const saltRounds = 10;
      const hashedPassword = await bcryptjs.hash(password, saltRounds);

      // Tạo người dùng mới
      const newUser = new User({
        phone,
        password: hashedPassword,
        role,
        avatar,
      });

      const savedUser = await newUser.save();

      if (role === "family_member") {
        io.to("staff_admin").emit("newFamilyMember", savedUser._id);
      }

      // Xóa mật khẩu khỏi dữ liệu trả về
      const userToReturn = savedUser.toObject();
      delete userToReturn.password;

      res.status(201).json(userToReturn);
    } catch (error) {
      console.error("Lỗi khi đăng ký user:", error);
      res.status(500).json({
        message: "Lỗi server",
        error: error.message,
      });
    }
  },

  // Đăng nhập
  loginUser: async (req, res) => {
    try {
      const { phone, password } = req.body;

      if (!phone || !password) {
        return res
          .status(400)
          .json({ message: "Vui lòng nhập đầy đủ phone và password" });
      }

      const user = await User.findOne({ phone });
      if (!user) {
        return res
          .status(400)
          .json({ message: "Số điện thoại này chưa được đăng ký" });
      }

      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Mật khẩu không đúng" });
      }

      const token = jwt.sign(
        { _id: user._id, role: user.role, avatar: user.avatar },
        process.env.SECRET_KEY,
        { expiresIn: "7d" }
      );

      const userToReturn = user.toObject();
      delete userToReturn.password;

      // ✅ Thêm bước: Lấy thêm thông tin doctor/nurse nếu cần
      let extraInfo = null;

      if (user.role === "doctor") {
        extraInfo = await Doctor.findOne({ userId: user._id });
      } else if (user.role === "nurse") {
        extraInfo = await Nurse.findOne({ userId: user._id });
      }

      res.status(200).json({
        message: "Đăng nhập thành công",
        token,
        user: userToReturn,
        extraInfo, // có thể là doctor hoặc nurse hoặc null
      });
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      res.status(500).json({
        message: "Lỗi server, vui lòng thử lại",
        error: error.message,
      });
    }
  },
  //quên mật khẩu

  uploadAvatar: async (req, res) => {
    try {
      const userId = req.user; // Lấy từ token đã xác thực
      const file = req.file;

      if (!file) return res.status(400).json({ message: "No file uploaded" });

      const result = await cloudinary.uploader.upload(file.path, {
        folder: "elder-care/avatar",
      });

      fs.unlinkSync(file.path); // Xoá file tạm

      const user = await User.findByIdAndUpdate(
        userId,
        { avatar: result.secure_url },
        { new: true }
      );

      if (!user) return res.status(404).json({ message: "User not found" });

      res.status(200).json({
        message: "Avatar uploaded successfully",
        avatarUrl: result.secure_url,
        user,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  uploadAvatarByAdmin: async (req, res) => {
    try {
      const file = req.file;

      if (!file) return res.status(400).json({ message: "No file uploaded" });

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "elder-care/avatar",
      });

      fs.unlinkSync(file.path); // Xoá file tạm

      // Trả về URL của ảnh đã upload
      res.json({ url: result.secure_url });
    } catch (error) {
      console.error("Error uploading image: ", error);
      res.status(500).send("Error uploading image");
    }
  },

  countMembersPerMonth: async (req, res) => {
    try {
      const now = new Date();
      const twelveMonthsAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 11, // lùi lại 11 tháng (tính cả tháng hiện tại là 12)
        1
      );

      const result = await User.aggregate([
        {
          $match: {
            role: "family_member",
            createdAt: { $gte: twelveMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]);

      // Tạo danh sách 12 tháng gần nhất theo dạng {year, month}
      const months = [];
      for (let i = 11; i >= 0; i--) {
        const date = moment().subtract(i, "months");
        months.push({ year: date.year(), month: date.month() + 1 }); // month trong moment bắt đầu từ 0
      }

      // Ánh xạ count tương ứng
      const counts = months.map(({ year, month }) => {
        const found = result.find(
          (item) => item._id.year === year && item._id.month === month
        );
        return found ? found.count : 0;
      });

      res.json({ data: counts });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Cập nhập trạng thái hoạt động của bác sĩ và điều dưỡng
  updateAvailabilityStatus: async (req, res) => {
    const { status } = req.body;
    const { _id: userId, role } = req.user;

    try {
      let updatedUser;

      // Kiểm tra xem người dùng là bác sĩ hay điều dưỡng và cập nhật trạng thái
      if (role === "doctor") {
        updatedUser = await Doctor.findOneAndUpdate(
          { userId },
          { isAvailable: status },
          { new: true }
        );
      } else if (role === "nurse") {
        updatedUser = await Nurse.findOneAndUpdate(
          { userId },
          { isAvailable: status },
          { new: true }
        );
      }

      // Nếu không tìm thấy người dùng, trả về lỗi
      if (!updatedUser) {
        return res.status(404).json({
          message: `${role.charAt(0).toUpperCase() + role.slice(1)
            } không tồn tại`,
        });
      }

      // Emit thông báo realtime cho các client có liên quan (bác sĩ/điều dưỡng)
      const io = getIO(); // Lấy instance của socket
      io.to(`${role}_room_${userId}`).emit(`${role}StatusUpdated`, {
        userId: updatedUser.userId,
        isAvailable: updatedUser.isAvailable,
      });

      return res.status(200).json({
        message: `Cập nhật trạng thái ${role} thành công`,
        user: updatedUser,
      });
    } catch (error) {
      console.error(`Lỗi khi cập nhật trạng thái ${role}:`, error);
      return res
        .status(500)
        .json({ message: "Lỗi server", error: error.message });
    }
  },

  getAllStaff: async (req, res) => {
    try {
      // Lấy danh sách bác sĩ
      const doctors = await Doctor.find()
        .populate("userId", "phone role avatar")
        .sort({ createdAt: -1 })
        .lean(); // Chuyển sang object JS thuần

      // Gắn thêm type để phân biệt
      const doctorsWithType = doctors.map((doc) => ({
        ...doc,
        type: "doctor",
      }));

      // Lấy danh sách điều dưỡng
      const nurses = await Nurse.find()
        .populate("userId", "phone role avatar")
        .sort({ createdAt: -1 })
        .lean();

      const nursesWithType = nurses.map((nurse) => ({
        ...nurse,
        type: "nurse",
      }));

      // Gộp 2 danh sách
      const staffList = [...doctorsWithType, ...nursesWithType];

      // Sắp xếp chung theo createdAt mới nhất
      staffList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      res.status(200).json({
        message: "Lấy danh sách nhân viên thành công",
        data: staffList,
      });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhân viên:", error);
      res.status(500).json({
        message: "Lỗi server",
        error: error.message,
      });
    }
  },

  changePassword: async (req, res) => {
    try {
      const { _id: userId } = req.user;
      const { oldPassword, newPassword } = req.body;

      //Kiểm tra có đúng mật khẩu cũ không
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }

      if (!oldPassword || !newPassword) {
        return res
          .status(400)
          .json({ message: "Vui lòng nhập đầy đủ mật khẩu cũ và mới" });
      }

      if (oldPassword === newPassword) {
        return res
          .status(400)
          .json({ message: "Mật khẩu mới không được giống mật khẩu cũ" });
      }

      if (oldPassword) {
        const isMatch = await bcryptjs.compare(oldPassword, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: "Mật khẩu cũ không đúng" });
        }
      }

      // Cập nhật mật khẩu mới
      const hashedNewPassword = await bcryptjs.hash(newPassword, 10);
      user.password = hashedNewPassword;
      await user.save();

      return res.status(200).json({ message: "Cập nhật mật khẩu thành công" });
    } catch (error) {
      console.error("Lỗi khi thay đổi mật khẩu:", error);
      return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  changePasswordByAdmin: async (req, res) => {
    try {
      const { userId } = req.params;
      const { oldPassword, newPassword } = req.body;

      //Kiểm tra có đúng mật khẩu cũ không
      const staff = await Doctor.findById(userId);
      if (!staff) {
        staff = await Nurse.findById(userId);
      }

      if (!staff) {
        return res.status(404).json({ message: "Nhân viên không tồn tại" });
      }

      const users = staff.userId;

      const infoUser = await User.findById({ _id: users })

      if (!infoUser) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }

      if (!oldPassword || !newPassword) {
        return res
          .status(400)
          .json({ message: "Vui lòng nhập đầy đủ mật khẩu cũ và mới" });
      }

      if (oldPassword === newPassword) {
        return res
          .status(400)
          .json({ message: "Mật khẩu mới không được giống mật khẩu cũ" });
      }

      if (oldPassword) {
        const isMatch = await bcryptjs.compare(oldPassword, infoUser.password);
        if (!isMatch) {
          return res.status(400).json({ message: "Mật khẩu cũ không đúng" });
        }
      }

      // Cập nhật mật khẩu mới
      const hashedNewPassword = await bcryptjs.hash(newPassword, 10);
      infoUser.password = hashedNewPassword;
      await infoUser.save();

      return res.status(200).json({ message: "Cập nhật mật khẩu thành công" });
    } catch (error) {
      console.error("Lỗi khi thay đổi mật khẩu:", error);
      return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  searchCustomer: async (req, res) => {
    try {
      const { _id, name, email, phone } = req.query;

      let filter = {};
      if (_id) filter._id = _id;
      if (name) filter.name = new RegExp(name, 'i');
      if (email) filter.email = new RegExp(email, 'i');
      if (phone) filter.phone = new RegExp(phone, 'i');

      if (!phone) {
        return res.status(400).json({ message: "Vui lòng nhập số điện thoại" });
      }

      // const regex = new RegExp(phone, "i"); 
      const customers = await User.find(filter);

      return res.status(200).json({
        message: "Tìm kiếm người dùng thành công",
        data: customers,
      });

    } catch (error) {
      console.error("Lỗi khi tìm kiếm người dùng:", error);
      return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  deleteOneUser: async (req, res) => {
    try {
      const { userId } = req.params;

      const deletedUser = await User.findByIdAndDelete(userId);

      const isDoctor = await Doctor.findOne({ userId });
      const isNurse = await Nurse.findOne({ userId });

      if (isDoctor) {
        await Doctor.findByIdAndDelete(isDoctor._id);
        return res.status(200).json({ message: "Xóa bác sĩ thành công" });
      }

      if (isNurse) {
        await Nurse.findByIdAndDelete(isNurse._id);
        return res.status(200).json({ message: "Xóa điều dưỡng thành công" });
      }

      if (!deletedUser) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }

      return res.status(200).json({ message: "Xóa người dùng thành công" });
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
      return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({ role: "family_member" })
        .select("-password")
        .sort({ createdAt: -1 })
        .populate("profiles");
      res
        .status(200)
        .json({ message: "Lấy danh sách người dùng thành công", data: users });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  deleteStaff: async (req, res) => {
    const io = getIO();
    try {
      const { userId, role } = req.user;
      const { staffId } = req.params;

      if (role !== 'admin') {
        return res.status(403).json({ message: "Bạn không có quyền xóa nhân viên." });
      }

      // Danh sách các model nhân viên cần kiểm tra
      const staffModels = [
        { model: Doctor, name: 'Doctor' },
        { model: Nurse, name: 'Nurse' }
      ];

      for (const { model, name } of staffModels) {
        const staff = await model.findById(staffId);
        if (staff) {
          // Xóa user liên kết
          await User.findByIdAndDelete(staff.userId);
          // Xóa nhân viên
          await model.findByIdAndDelete(staffId);

          io.to('staff_admin').emit('newStaffCreated', staff);

          return res.status(200).json({
            message: `Đã xóa ${name} thành công.`,
            staff
          });
        }
      }

      return res.status(404).json({ message: "Không tìm thấy nhân viên để xóa." });

    } catch (error) {
      console.error("Lỗi khi xóa nhân viên:", error);
      return res.status(500).json({
        message: "Lỗi khi xóa nhân viên!",
        error
      });
    }
  },

  getStaffById: async (req, res) => {
    try {
      const { _id } = req.params;

      let staff = await Doctor.findById(_id).populate('userId');

      if (!staff) {
        staff = await Nurse.findById(_id).populate('userId');
      }

      if (!staff) {
        return res.status(404).json({
          message: "Không tìm thấy nhân viên!",
        });
      }

      return res.status(200).json(staff);

    } catch (error) {
      return res.status(500).json({
        message: "Lỗi khi lấy thông in nhân viên!",
        error
      })
    }
  },

  //Xóa khách hàng bởi Admin
  deleteCustomerByAdmin: async (req, res) => {
    try {
      const { customerId } = req.params;

      const deletedUser = await User.findOneAndDelete({
        _id: customerId,
        role: "family_member"
      });

      if (!deletedUser) {
        return res.status(404).json({ message: "Không tìm thấy khách hàng để xóa." });
      }

      return res.status(200).json({ message: "Xóa khách hàng thành công." });
    } catch (error) {
      console.error("Lỗi khi xóa khách hàng:", error);
      return res.status(500).json({
        message: "Lỗi khi xóa khách hàng!",
        error: error.message
      });
    }
  },

  //Đếm khách hàng 
  countCustomersTodayMonthYear: async (req, res) => {
    try {
      const now = new Date();

      // Đầu ngày hôm nay
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      // Đầu tháng này
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      // Đầu năm nay
      const startOfYear = new Date(now.getFullYear(), 0, 1);

      // Đếm khách hàng tạo hôm nay
      const countToday = await User.countDocuments({
        role: "family_member",
        createdAt: { $gte: startOfToday }
      });

      // Đếm khách hàng tạo trong tháng này
      const countMonth = await User.countDocuments({
        role: "family_member",
        createdAt: { $gte: startOfMonth }
      });

      // Đếm khách hàng tạo trong năm nay
      const countYear = await User.countDocuments({
        role: "family_member",
        createdAt: { $gte: startOfYear }
      });

      res.status(200).json({
        today: countToday,
        month: countMonth,
        year: countYear
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  //Lấy thông tin của khách hàng
  getCustomerById: async (req, res) => {
    try {
      const { customerId } = req.params;
      const user = await User.findOne({ _id: customerId, role: "family_member" }).populate("profiles");
      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy khách hàng." });
      }
      let firstProfileName = null;
      if (user.profiles && user.profiles.length > 0) {
        const profile = user.profiles[0];
        const firstName = profile.firstName || "";
        const lastName = profile.lastName || "";
        firstProfileName = `${firstName} ${lastName}`.trim() || null;
      }
      return res.status(200).json({
        message: "Lấy thông tin khách hàng thành công.",
        customer: {
          _id: user._id,
          phone: user.phone,
          avatar: user.avatar || "",
          name: firstProfileName
        }
      });
    } catch (error) {
      return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  sortCustomersByCreatedAt: async (req, res) => {
    try {
      const { order } = req.query; // order = 'asc' (cũ nhất) hoặc 'desc' (mới nhất)
      const sortOrder = order === 'asc' ? 1 : -1;

      const customers = await User.find({ role: "family_member" })
        .select("-password")
        .sort({ createdAt: sortOrder })
        .populate("profiles");

      res.status(200).json({
        message: "Sắp xếp khách hàng thành công",
        data: customers,
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  countStaffByMonth: async (req, res) => {
    try {
      const now = new Date();
      // Lấy ngày đầu tiên của tháng hiện tại, sau đó lùi về 11 tháng trước
      const startMonth = new Date(now.getFullYear(), now.getMonth() - 11, 1);
      const endMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      // Đếm bác sĩ theo tháng
      const doctorCounts = await Doctor.aggregate([
        {
          $match: {
            createdAt: { $gte: startMonth, $lt: endMonth }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]);

      // Đếm điều dưỡng theo tháng
      const nurseCounts = await Nurse.aggregate([
        {
          $match: {
            createdAt: { $gte: startMonth, $lt: endMonth }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]);

      // Tạo mảng 12 tháng gần nhất (theo định dạng YYYY-MM)
      const months = [];
      const counts = [];
      for (let i = 0; i < 12; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // 1-based
        months.push(`${year}-${month.toString().padStart(2, "0")}`);
        counts.push(0);
      }

      // Gộp kết quả bác sĩ và điều dưỡng vào mảng counts
      const addCounts = (arr) => {
        arr.forEach(item => {
          const idx = months.findIndex(m =>
            m === `${item._id.year}-${item._id.month.toString().padStart(2, "0")}`
          );
          if (idx !== -1) {
            counts[idx] += item.count;
          }
        });
      };
      addCounts(doctorCounts);
      addCounts(nurseCounts);

      return res.status(200).json({ data: counts, months });
    } catch (error) {
      return res.status(500).json({
        message: "Lỗi khi đếm nhân viên theo tháng",
        error: error.message
      });
    }
  },

  countStaffInLast12Months: async (req, res) => {
    try {
      const now = new Date();
      const startMonth = new Date(now.getFullYear(), now.getMonth() - 11, 1);
      const endMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      // Đếm bác sĩ theo tháng
      const doctorCounts = await Doctor.aggregate([
        {
          $match: {
            createdAt: { $gte: startMonth, $lt: endMonth }
          }
        },
        {
          $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            count: { $sum: 1 }
          }
        }
      ]);

      // Đếm điều dưỡng theo tháng
      const nurseCounts = await Nurse.aggregate([
        {
          $match: {
            createdAt: { $gte: startMonth, $lt: endMonth }
          }
        },
        {
          $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            count: { $sum: 1 }
          }
        }
      ]);

      // Tạo mảng 12 tháng gần nhất (YYYY-MM)
      const months = [];
      const counts = [];
      for (let i = 0; i < 12; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        months.push(`${year}-${month.toString().padStart(2, "0")}`);
        counts.push(0);
      }

      // Gộp kết quả bác sĩ và điều dưỡng vào mảng counts
      const addCounts = (arr) => {
        arr.forEach(item => {
          const idx = months.findIndex(m =>
            m === `${item._id.year}-${item._id.month.toString().padStart(2, "0")}`
          );
          if (idx !== -1) {
            counts[idx] += item.count;
          }
        });
      };
      addCounts(doctorCounts);
      addCounts(nurseCounts);

      return res.status(200).json({ data: counts, months });
    } catch (error) {
      return res.status(500).json({
        message: "Lỗi khi đếm nhân viên trong 12 tháng gần nhất",
        error: error.message
      });
    }
  },

  // Search Customer
  searchCustomer: async (req, res) => {
    try {
      const { search, gender, dateFrom, dateTo, sort = "newest" } = req.query;

      // Lọc theo createdAt của User
      const userFilter = {
        role: "family_member",
      };
      if (dateFrom || dateTo) {
        userFilter.createdAt = {};
        if (dateFrom) userFilter.createdAt.$gte = new Date(dateFrom);
        if (dateTo) userFilter.createdAt.$lte = new Date(dateTo);
      }

      // Sort option
      let sortOption = {};
      switch (sort) {
        case "newest": sortOption = { createdAt: -1 }; break;
        case "oldest": sortOption = { createdAt: 1 }; break;
        case "name_asc": sortOption = { phone: 1 }; break;
        case "name_desc": sortOption = { phone: -1 }; break;
        default: sortOption = { createdAt: -1 };
      }

      const pipeline = [
        { $match: userFilter },
        {
          $lookup: {
            from: "profiles",
            localField: "profiles",
            foreignField: "_id",
            as: "profileDocs"
          }
        },
        {
          $addFields: {
            firstProfile: { $arrayElemAt: ["$profileDocs", 0] }
          }
        }
      ];

      // Lọc theo giới tính (sex trong firstProfile)
      if (gender) {
        pipeline.push({
          $match: {
            "firstProfile.sex": gender
          }
        });
      }

      // Lọc theo tên và số điện thoại
      if (search) {
        const regex = new RegExp(search, "i");
        pipeline.push({
          $match: {
            $or: [
              { phone: { $regex: regex } },
              { "firstProfile.firstName": { $regex: regex } },
              { "firstProfile.lastName": { $regex: regex } }
            ]
          }
        });
      }

      pipeline.push({ $sort: sortOption });

      const customers = await User.aggregate(pipeline);

      res.json({
        data: customers,
        total: customers.length
      });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getStaffDetail: async (req, res) => {
    try {
      const { userId } = req.params;

      // Tìm trong Doctor trước
      let staff = await Doctor.findOne({ userId }).populate('userId');
      let type = "doctor";

      if (!staff) {
        // Nếu không phải doctor, tìm trong Nurse
        staff = await Nurse.findOne({ userId }).populate('userId');
        type = "nurse";
      }

      if (!staff) {
        return res.status(404).json({ message: "Không tìm thấy nhân viên với userId này." });
      }

      return res.status(200).json({
        type,
        staff
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error",
        error
      })
    }
  },

  deleteAll: async (req, res) => {
    try {
      // Xóa tất cả dữ liệu ở tất cả các bảng (collection)
      const mongoose = (await import('mongoose')).default;
      const collections = Object.keys(mongoose.connection.collections);

      // Thực hiện xóa dữ liệu cho từng collection
      for (const collectionName of collections) {
        await mongoose.connection.collections[collectionName].deleteMany({});
      }

      res.status(200).json({ message: "Đã xóa toàn bộ dữ liệu trong tất cả các bảng (collections)." });
    } catch (error) {
      return res.status(500).json({
        message: "Lỗi khi xóa toàn bộ dữ liệu",
        error
      });
    }
  }
};

export default authController;

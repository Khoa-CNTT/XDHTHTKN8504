import Booking from "../models/Booking.js";
import Profile from "../models/Profile.js";
import Schedule from "../models/Schedule.js";
import moment from "moment-timezone";
import Service from "../models/Service.js";
import { getIO } from "../config/socketConfig.js";
import { getUserSocketId } from '../controllers/socketController.js';
import Doctor from "../models/Doctor.js";
import Nurse from "../models/Nurse.js";

const bookingController = {
    // create new booking
    createBooking: async (req, res) => {
        try {
            const {
                profileId,
                serviceId,
                status,
                notes,
                paymentId,
                participants,
                repeatFrom,
                repeatTo,
                timeSlot
            } = req.body;

            const { _id: userId, role } = req.user;

            // Kiểm tra profile
            const profile = await Profile.findById(profileId);
            if (!profile) {
                return res.status(404).json({ message: "Không tìm thấy hồ sơ (profile)" });
            }

            const service = await Service.findById(serviceId);
            if (!service) {
                return res.status(404).json({ message: "Không tìm thấy dịch vụ" });
            }

            // Kiểm tra quyền của family_member
            if (role === "family_member" || role === "admin") {
                if (profile.userId.toString() !== userId.toString()) {
                    return res.status(403).json({ message: "Không có quyền đặt lịch cho profile này" });
                }
            }

            // Kiểm tra thời gian lặp lại
            const fromDate = new Date(repeatFrom);
            const toDate = new Date(repeatTo);

            console.log("From Date:", fromDate);
            console.log("To Date:", toDate);

            if (fromDate >= toDate) {
                return res.status(400).json({ message: "Ngày bắt đầu phải nhỏ hơn ngày kết thúc" });
            }

            // Tính số ngày
            const daysDiff = Math.floor((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;

            // Tính số giờ mỗi ngày (có xử lý qua đêm)
            const getHoursDiff = (start, end) => {
                const [sh, sm] = start.split(":").map(Number);
                const [eh, em] = end.split(":").map(Number);
                const startMin = sh * 60 + sm;
                const endMin = eh * 60 + em;
                const diff = endMin >= startMin ? endMin - startMin : 24 * 60 - startMin + endMin;
                return diff / 60;
            };

            const hoursPerDay = getHoursDiff(timeSlot.start, timeSlot.end);

            // Tổng tiền
            const totalPrice = hoursPerDay * daysDiff * service.price || 0;
            const totalDiscount = totalPrice * (service.percentage || 0);

            // Xác định nếu là lịch lặp lại
            const isRecurring = new Date(repeatFrom).toDateString() !== new Date(repeatTo).toDateString();

            // Tạo booking mới 
            const newBooking = new Booking({
                profileId,
                serviceId,
                status: status || "pending",
                notes,
                paymentId,
                participants,
                repeatFrom: fromDate,
                repeatTo: toDate,
                timeSlot,
                totalPrice,
                totalDiscount,
                isRecurring,
                createdBy: userId,
            });
            await newBooking.save();
            const io = getIO();

            const populatedBooking = await Booking.findById(newBooking._id).populate('serviceId').populate("profileId");


            const targetRole = populatedBooking?.serviceId?.role;

            if (targetRole === "nurse" || targetRole === "doctor") {
                io.to(`staff_${targetRole}`).emit(
                    "newBookingSignal",
                    populatedBooking
                );
            }

            return res.status(201).json({
                message: "Booking created successfully",
                booking: newBooking,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    },

    // acceptBooking: async (req, res) => {
    //     const io = getIO();
    //     try {
    //         const { bookingId } = req.params;
    //         const staff = req.user;

    //         const booking = await Booking.findById(bookingId);
    //         if (!booking) return res.status(404).json({ message: 'Đơn đặt lịch không tồn tại' });

    //         const service = await Service.findById(booking.serviceId);
    //         if (!service) return res.status(404).json({ message: 'Không tìm thấy dịch vụ liên quan' });

    //         const profile = await Profile.findById(booking.profileId);
    //         if (!profile) return res.status(404).json({ message: 'Không tìm thấy thông tin bệnh nhân' });

    //         const patientName = `${profile.firstName} ${profile.lastName}`;
    //         const timeSlots = Array.isArray(booking.timeSlot) ? booking.timeSlot : [booking.timeSlot];

    //         const timeZone = 'Asia/Ho_Chi_Minh';
    //         let currentDate = moment.tz(booking.repeatFrom, timeZone);
    //         const repeatTo = moment.tz(booking.repeatTo, timeZone);

    //         const schedulePromises = [];

    //         while (currentDate <= repeatTo) {
    //             for (const timeSlot of timeSlots) {
    //                 const startDateTime = moment.tz(`${currentDate.format('YYYY-MM-DD')}T${timeSlot.start}:00`, timeZone);
    //                 const endDateTime = moment.tz(`${currentDate.format('YYYY-MM-DD')}T${timeSlot.end}:00`, timeZone);

    //                 //Kiểm tra trùng lịch
    //                 const isConflict = await Schedule.findOne({
    //                     staffId: staff._id,
    //                     'timeSlots.start': { $lt: endDateTime.toDate() },
    //                     'timeSlots.end': { $gt: startDateTime.toDate() },
    //                 });

    //                 if (isConflict) {
    //                     return res.status(409).json({
    //                         message: `Lịch bị trùng vào ngày ${currentDate.format('DD/MM/YYYY')} từ ${timeSlot.start} đến ${timeSlot.end}`,
    //                     });
    //                 }

    //                 // Nếu không trùng thì tạo schedule
    //                 const schedule = new Schedule({
    //                     staffId: staff._id,
    //                     role: staff.role,
    //                     bookingId: booking._id,
    //                     patientName,
    //                     serviceName: service.name,
    //                     date: currentDate.clone().toDate(),
    //                     timeSlots: [{
    //                         start: startDateTime.toDate(),
    //                         end: endDateTime.toDate()
    //                     }],
    //                     status: 'scheduled',
    //                 });

    //                 schedulePromises.push(schedule.save());
    //             }

    //             currentDate.add(1, 'days');
    //         }

    //         booking.status = 'accepted';
    //         booking.acceptedBy = staff._id;

    //         const alreadyParticipant = booking.participants.some(p =>
    //             p.userId.toString() === staff._id.toString()
    //         );

    //         if (!alreadyParticipant) {
    //             booking.participants.push({
    //                 userId: staff._id,
    //                 role: staff.role,
    //                 acceptedAt: new Date(),
    //             });
    //         }

    //         await booking.save();
    //         await Promise.all(schedulePromises);

    //         // Gửi thông báo qua socket
    //         const customerId = booking.createdBy.toString();
    //         const socketId = getUserSocketId(customerId);
    //         if (socketId) {
    //             io.to(socketId).emit("bookingAccepted", {
    //                 bookingId,
    //             });
    //         }

    //         booking.participants.forEach(p => {
    //             const staffSocketId = getUserSocketId(p.userId.toString());
    //             if (staffSocketId) {
    //                 io.to(staffSocketId).emit("bookingAccepted", {
    //                     bookingId,
    //                 });
    //             }
    //         });

    //         return res.status(200).json({
    //             message: 'Đã chấp nhận lịch hẹn và tạo lịch làm việc thành công',
    //             schedule: schedulePromises,
    //         });
    //     } catch (error) {
    //         console.error(error);
    //         return res.status(500).json({ message: 'Lỗi server', error: error.message });
    //     }
    // },
    acceptBooking: async (req, res) => {
        const io = getIO();

        try {
            const { bookingId } = req.params;
            const staff = req.user;

            const booking = await Booking.findById(bookingId);
            if (!booking) return res.status(404).json({ message: 'Đơn đặt lịch không tồn tại' });

            const service = await Service.findById(booking.serviceId);
            if (!service) return res.status(404).json({ message: 'Không tìm thấy dịch vụ liên quan' });

            const profile = await Profile.findById(booking.profileId);
            if (!profile) return res.status(404).json({ message: 'Không tìm thấy thông tin bệnh nhân' });

            const patientName = `${profile.firstName} ${profile.lastName}`;
            const timeSlots = Array.isArray(booking.timeSlot) ? booking.timeSlot : [booking.timeSlot];
            const timeZone = 'Asia/Ho_Chi_Minh';

            let currentDate = moment.tz(booking.repeatFrom, timeZone);
            const repeatTo = moment.tz(booking.repeatTo, timeZone);
            const schedules = [];

            while (currentDate <= repeatTo) {
                for (const timeSlot of timeSlots) {
                    const startDateTime = moment.tz(`${currentDate.format('YYYY-MM-DD')}T${timeSlot.start}:00`, timeZone);
                    const endDateTime = moment.tz(`${currentDate.format('YYYY-MM-DD')}T${timeSlot.end}:00`, timeZone);

                    // Kiểm tra trùng lịch cùng ngày
                    const isConflict = await Schedule.findOne({
                        staffId: staff._id,
                        date: {
                            $gte: currentDate.clone().startOf('day').toDate(),
                            $lte: currentDate.clone().endOf('day').toDate()
                        },
                        'timeSlots.start': { $lt: endDateTime.toDate() },
                        'timeSlots.end': { $gt: startDateTime.toDate() },
                    });

                    if (isConflict) {
                        return res.status(409).json({
                            message: `Lịch bị trùng vào ngày ${currentDate.format('DD/MM/YYYY')} từ ${timeSlot.start} đến ${timeSlot.end}`,
                        });
                    }

                    const schedule = new Schedule({
                        staffId: staff._id,
                        role: staff.role,
                        bookingId: booking._id,
                        patientName,
                        serviceName: service.name,
                        date: currentDate.clone().toDate(),
                        timeSlots: [{
                            start: startDateTime.toDate(),
                            end: endDateTime.toDate()
                        }],
                        status: 'scheduled',
                    });

                    schedules.push(schedule);
                }

                currentDate.add(1, 'days');
            }

            // Cập nhật thông tin booking
            booking.status = 'accepted';
            booking.acceptedBy = staff._id;

            const alreadyParticipant = booking.participants.some(p =>
                p.userId.toString() === staff._id.toString()
            );

            let fullName = "Không rõ";

            if (staff.role === 'doctor') {
                const doctor = await Doctor.findOne({ userId: staff._id });
                if (doctor) {
                    fullName = `${doctor.firstName} ${doctor.lastName}`;
                }
            } else if (staff.role === 'nurse') {
                const nurse = await Nurse.findOne({ userId: staff._id });
                if (nurse) {
                    fullName = `${nurse.firstName} ${nurse.lastName}`;
                }
            }

            // Thêm participant nếu chưa có
            if (!alreadyParticipant) {
                booking.participants.push({
                    userId: staff._id,
                    role: staff.role,
                    fullName: fullName,
                    acceptedAt: new Date(),
                });
            }

            await booking.save();
            await Promise.all(schedules.map(s => s.save()));

            // Gửi thông báo socket cho người tạo và tất cả người tham gia
            const allUserIds = new Set([
                booking.createdBy?.toString(),
                ...booking.participants?.map(p => p.userId?.toString())
            ]);


            allUserIds.forEach(userId => {
                const socketId = getUserSocketId(userId);
                console.log(`UserId: ${userId} - SocketId: ${socketId}`);

                if (socketId) {
                    io.to(socketId).emit("bookingAccepted", {
                        bookingId: booking._id,
                        message: "Lịch đặt đã được chấp nhận"
                    });
                } else {
                    console.log(`⚠️ Không tìm thấy socket cho userId: ${userId}`);
                }
            });

            return res.status(200).json({
                message: 'Đã chấp nhận lịch hẹn và tạo lịch làm việc thành công',
                schedule: schedules,
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    },

    getBookingById: async (req, res) => {
        try {
            const { staffId } = req.user._id;
            const { bookingId } = req.params;

            // Tìm booking theo bookingId
            const booking = await Booking.findById(bookingId).populate("profileId").populate("serviceId");
            if (!booking) {
                return res.status(404).json({ message: 'Đơn đặt lịch không tồn tại' });
            }

            // Kiểm tra quyền truy cập
            if (booking.staffId && booking.staffId.toString() !== staffId.toString()) {
                return res.status(403).json({ message: 'Bạn không có quyền truy cập vào booking này' });
            }

            console.log("Người dùng từ token:", req.user);

            // Trả về thông tin booking
            return res.status(200).json({
                message: 'Lấy thông tin booking thành công',
                booking: booking,
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    },

    getCompletedBookings: async (req, res) => {
        try {
            const { _id: staffId } = req.user;
            let { year, month } = req.query;

            // Nếu không có tham số year và month, mặc định lấy năm và tháng hiện tại
            if (!year || !month) {
                const currentDate = moment();  // Lấy thời gian hiện tại
                year = currentDate.year();     // Lấy năm hiện tại
                month = currentDate.month() + 1;
            }

            // Chuyển year, month thành dạng startOf và endOf tháng
            const startOfMonth = moment(`${year}-${month}-01`).startOf('month').toDate();
            const endOfMonth = moment(`${year}-${month}-01`).endOf('month').toDate();

            // Tìm tất cả các booking đã completed trong tháng này, mà staff đó đã tham gia
            const bookings = await Booking.find({
                status: 'completed',
                'participants.userId': staffId,
                updatedAt: { $gte: startOfMonth, $lte: endOfMonth },
            }).populate('profileId serviceId');

            if (!bookings.length) {
                return res.status(404).json({ message: 'Không có lịch hoàn thành trong tháng này' });
            }

            // Chuyển dữ liệu thành cấu trúc trả về cho frontend
            const results = bookings.map((booking) => ({
                bookingId: booking._id,
                patientName: booking.profileId?.firstName + " " + booking.profileId?.lastName,
                serviceName: booking.serviceId?.name,
                salary: booking.totalDiscount,
                completedAt: booking.updatedAt,
            }));

            return res.status(200).json({
                message: 'Danh sách booking đã hoàn thành trong tháng',
                bookings: results,
            });

        } catch (error) {
            console.error("Lỗi khi lấy booking:", error);
            return res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    },

    getBookingForStaff: async (req, res) => {
        try {
            const user = req.user;

            const bookings = await Booking.find()
                .populate({
                    path: 'serviceId',
                    match: { role: user.role } // chỉ lấy những service đúng vai trò
                })

            // Lọc bỏ các booking mà serviceId bị null (do không match role)
            const filteredBookings = bookings.filter(booking => booking.serviceId);

            return res.status(200).json({
                message: 'Lấy booking theo vai trò thành công!',
                data: filteredBookings
            });
        } catch (error) {
            console.error("Lỗi khi lấy booking:", error);
            return res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    },

    getBookingForCustomer: async (req, res) => {
        try {
            const user = req.user;

            const bookings = await Booking.find({ createdBy: user._id }).populate('serviceId').populate('profileId');

            if (!bookings || bookings.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy booking nào' });
            }

            return res.status(200).json({
                message: 'Lấy booking cho khách hàng thành công!',
                data: bookings
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
                error: error.message,
            })
        }
    },

    countBookingsLast12Months: async (req, res) => {
        try {
            const now = new Date();
            const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1); // Đầu tháng cách đây 11 tháng

            const result = await Booking.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate }
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
                {
                    $sort: { "_id.year": 1, "_id.month": 1 }
                }
            ]);

            // Tạo danh sách 12 tháng gần nhất
            const labels = [];
            const datas = [];

            for (let i = 0; i < 12; i++) {
                const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
                const year = d.getFullYear();
                const month = d.getMonth() + 1;

                const found = result.find(r => r._id.year === year && r._id.month === month);
                labels.push(`${month < 10 ? '0' + month : month}/${year}`);
                datas.push(found ? found.datas : 0);
            }

            return res.status(200).json({
                labels,
                datas,
            });

        } catch (err) {
            console.error("Lỗi khi đếm booking 12 tháng:", err);
            res.status(500).json({ message: "Server error", error: err });
        }
    },

    getAllBookings: async (req, res) => {
        try {
            await Booking.find()
                .populate('profileId')
                .populate('serviceId')
                .then((bookings) => {
                    return res.status(200).json({
                        message: 'Lấy tất cả booking thành công!',
                        bookings
                    });
                })
                .catch((error) => {
                    console.error("Lỗi khi lấy tất cả booking:", error);
                    return res.status(500).json({ message: 'Lỗi server', error: error.message });
                });
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    },

    canceledBooking: async (req, res) => {
        try {
            const { _id: userId } = req.user;
            const { bookingId } = req.params;

            const booking = await Booking.findById(bookingId);

            if (!booking) {
                return res.status(404).json({ message: 'Không tìm thấy booking' });
            }

            if (userId.toString() !== booking.createdBy.toString()) {
                return res.status(403).json({ message: 'Bạn không có quyền hủy booking này' });
            }

            if (booking.status === 'completed' || booking.status === 'cancelled') {
                return res.status(400).json({ message: 'Booking đã được xử lý hoặc đã bị hủy trước đó' });
            }

            if (booking.status === 'pending') {
                booking.status = 'cancelled';
                await booking.save();
            }

            res.status(200).json({ message: 'Hủy booking thành công', booking });

        } catch (error) {
            console.error("Lỗi khi hủy booking:", error);
            res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    },

    getCompletedPatients: async (req, res) => {
        try {
            const { _id: adminId } = req.user;

            const bookings = await Booking.find({ status: 'completed' })
                .populate('profileId')
                .populate('createdBy', 'phone')
                .sort({ updatedAt: -1 });

            // Lấy danh sách bệnh nhân không trùng lặp
            const uniqueProfiles = [];
            const profileIds = new Set();

            bookings.forEach(booking => {
                const profile = booking.profileId;
                if (profile && !profileIds.has(profile._id.toString())) {
                    uniqueProfiles.push({
                        ...profile.toObject(),
                        bookedByPhone: booking.createdBy?.phone || '',
                        bookingDate: booking.updatedAt,
                    });
                    profileIds.add(profile._id.toString());
                }
            });

            res.status(200).json({ patients: uniqueProfiles });
        } catch (error) {
            console.error("Lỗi khi lấy danh sách bệnh nhân:", error);
            res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    },

    deleteAllBookings: async (req, res) => {
        try {
            await Booking.deleteMany();
            return res.status(200).json({ message: 'Tất cả bookings đã được xoá thành công.' });
        } catch (error) {
            console.error("Lỗi khi xóa booking:", error);
            return res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    },
}

export default bookingController;
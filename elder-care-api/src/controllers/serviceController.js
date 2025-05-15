import Service from '../models/Service.js';
import { getIO } from "../config/socketConfig.js";

const serviceController = {
    // ceate service
    createService: async (req, res) => {
        const io = getIO();
        try {
            const { name, description, price, percentage, role, imgUrl } = req.body;

            // check if service already exists
            const existingService = await Service.findOne({ name });
            if (existingService) {
                return res.status(400).json({
                    message: "Dịch vụ đã tồn tại!",
                })
            }

            // create new service
            const newService = new Service({
                name,
                description,
                price,
                percentage,
                role,
                imgUrl
            })

            await newService.save();

            io.to("staff_admin").emit("newServiceCreated", newService);

            return res.status(201).json({
                message: "Thêm mới dịch vụ thành công!",
                service: newService,
            })
        } catch (error) {
            return res.status(500).json({
                message: "Lỗi hệ thống!",
                error: error.message,
            })
        }
    },

    getService: async (req, res) => {
        try {
            const services = await Service.find({}).select("-__v");

            return res.status(200).json({
                success: true,
                service: services,
            });
            
        } catch (error) {
            console.error("Error in getService:", error);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    },

    updateService: async (req, res) => {
        try {
            const { serviceId } = req.params;
            const updateInfo = req.body;

            const updateService = await Service.findByIdAndUpdate(
                serviceId,
                updateInfo,
                { new: true, runValidators: true }
            );

            if (!updateService) {
                return res.status(404).json({ message: "Dịch vụ không tồn tại!" });
            }

            return res.status(200).json({
                message: "Cập nhật dịch vụ thành công!",
                service: updateService,
            });

        } catch (error) {
            console.error("Error in updateService:", error);
            return res.status(500).json({ success: false, message: "Server error" });            
        }
    },

    deleteService: async(req, res) => {
        try {
            const { serviceId } = req.params;

            const deleteService = await Service.findByIdAndDelete(serviceId);
            if (!deleteService) {
                return res.status(404).json({ message: "Dịch vụ không tồn tại!" });
            }

            return res.status(200).json({
                message: "Xóa dịch vụ thành công!",
                service: deleteService,
            });
        } catch (error) {
            console.error("Error in deleteService:", error);
            return res.status(500).json({ success: false, message: "Server error" });            
        }
    },
    deleteAllServices: async (req, res) => {
        try {
          const result = await Service.deleteMany({});
          res.status(200).json({
            message: "All services have been deleted",
            deletedCount: result.deletedCount,
          });
        } catch (error) {
          console.error("Error deleting services:", error);
          res.status(500).json({ message: "Failed to delete services", error });
        }
    }

}

export default serviceController;
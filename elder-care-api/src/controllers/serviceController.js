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
    }

}

export default serviceController;
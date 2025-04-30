import Service from '../models/Service.js';

const serviceController = {
    // ceate service
    createService: async (req, res) => {
        try {
            const { name, description, price, percentage, role } = req.body;

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
                role
            })

            await newService.save();
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
            const services = await Service.find({}).select("-__v"); // (optional) bỏ __v cho sạch

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
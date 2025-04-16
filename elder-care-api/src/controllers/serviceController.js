import Service from '../models/Service.js';

const serviceController = {
    // ceate service
    createService: async (req, res) => {
        try {
            const { name, description, price } = req.body;

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
    }
}

export default serviceController;
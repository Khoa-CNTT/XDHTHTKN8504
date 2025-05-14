import Packages from "../models/Package.js";

const packageController = {
    // Create a new package
    createPackage: async (req, res) => {
        try {
            const { serviceId, name, description, price, totalDays, repeatInterval, timeWork, discount } = req.body;

            if (!serviceId || !name || !description || !price || !totalDays || !repeatInterval || !timeWork) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            let discountedPrice = 0

            if (discount > 0) {
                discountedPrice = price - (price * (discount / 100));
            } else {
                discountedPrice = price;
            }

            const newPackage = new Packages({
                serviceId,
                name,
                description,
                price: discountedPrice,
                totalDays,
                repeatInterval,
                timeWork,
                discount,
            });

            await newPackage.save();

            return res.status(201).json({
                message: "Thêm mới gói dịch vụ thành công!",
                package: newPackage,
            });
        } catch (error) {
            res.status(500).json({
                message: "Error creating package",
                error: error.message,
            });
        }
    },

    // Get all packages
    getPackagesForService: async (req, res) => {
        try {
            const { serviceId } = req.params;

            const packages = await Packages.find({ serviceId })

            return res.status(200).json({
                success: true,
                packages: packages,
            });
        } catch (error) {
            console.error("Error in getAllPackages:", error);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    },

    getAllPackages: async (req, res) => {
        try {
            const packages = await Packages.find().select("-__v");

            return res.status(200).json({
                success: true,
                packages: packages,
            });
        } catch (error) {
            console.error("Error in getAllPackages:", error);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    },
    deleteAllPackages: async (req, res) => {
        try {
          const result = await Packages.deleteMany({});
          res.status(200).json({
            message: "All packages have been deleted",
            deletedCount: result.deletedCount, // Trả về số lượng package đã bị xóa
          });
        } catch (error) {
          console.error("Error deleting packages:", error);
          res.status(500).json({ message: "Failed to delete packages", error });
        }
    }
}

export default packageController;
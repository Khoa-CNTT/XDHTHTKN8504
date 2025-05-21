import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Nurse from "../models/Nurse.js";
import Invoice from "../models/Invoice.js";

const invoiceController = {
    getInvoice: async (req, res) => {
        try {
            const invoices = await Invoice.find()
                .populate({
                    path: 'bookingId',
                    populate: {
                        path: 'profileId',
                        model: 'Profile'
                    }
                });
            res.status(200).json(invoices);
        } catch (error) {
            res.status(500).json({ message: "Error fetching invoices", error: error.message });
        }
    }
}

export default invoiceController;
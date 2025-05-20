import mongoose from 'mongoose'

const ReviewSchema = new mongoose.Schema({
  scheduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule',
    required: true,
  },
  bookingId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Booking',
    required: true
  },
  reviewer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Profile',
    required: true
  },
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: String,
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', ReviewSchema);

export default Review
import mongoose from 'mongoose';

const dropSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
  },
  phoneNo: {
    type: String,
    required: [true, 'Phone number is required'],
  },
  pickupLocation: {
    type: String,
    required: [true, 'Pickup location is required'],
  },
  dropLocation: {
    type: String,
    required: [true, 'Drop location is required'],
  },
  dateTime: {
    type: Date,
    required: [true, 'Date and time are required'],
  },
  vehicleName: {
    type: String,
    required: [true, 'Vehicle name is required'],
  },
});

const Drop = mongoose.model('Drop', dropSchema);

export default Drop;
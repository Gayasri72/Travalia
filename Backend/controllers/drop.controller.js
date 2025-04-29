import Drop from '../models/drop.model.js';

// Controller to create a new drop
export const createDrop = async (req, res) => {
  try {
    const { customerName, email, phoneNo, pickupLocation, dropLocation, dateTime, vehicleName } = req.body;

    if (!customerName || !email || !phoneNo || !pickupLocation || !dropLocation || !dateTime || !vehicleName) {
      return res.status(400).json({
        status: 'fail',
        message: 'All fields are required',
      });
    }

    const newDrop = await Drop.create({
      customerName,
      email,
      phoneNo,
      pickupLocation,
      dropLocation,
      dateTime,
      vehicleName, // Include vehicleName in the database
    });

    res.status(201).json({
      status: 'success',
      data: newDrop,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Controller to get all drops
export const getAllDrops = async (req, res) => {
  try {
    const drops = await Drop.find();

    res.status(200).json({
      status: 'success',
      results: drops.length,
      data: drops,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Controller to delete a drop booking
export const deleteDrop = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDrop = await Drop.findByIdAndDelete(id);

    if (!deletedDrop) {
      return res.status(404).json({
        status: 'fail',
        message: 'Drop booking not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Drop booking deleted successfully',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Controller to get booking hires
export const getBookingHires = async (req, res) => {
  try {
    const hires = await Drop.find(); // Replace 'Drop' with the appropriate model if needed

    res.status(200).json({
      status: 'success',
      results: hires.length,
      data: hires,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};
import Drop from '../models/drop.model.js';

// Controller to create a new drop
export const createDrop = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'fail',
        message: 'You must be logged in to create a drop booking.',
      });
    }

    const { customerName, phoneNo, pickupLocation, dropLocation, dateTime, vehicleName } = req.body;

    if (!customerName || !phoneNo || !pickupLocation || !dropLocation || !dateTime || !vehicleName) {
      return res.status(400).json({
        status: 'fail',
        message: 'All fields are required',
      });
    }

    const newDrop = await Drop.create({
      customerName,
      email: req.user.email, // Use logged-in user's email
      phoneNo,
      pickupLocation,
      dropLocation,
      dateTime,
      vehicleName,
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

// Controller to get all drops for the logged-in user
export const getAllDrops = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'fail',
        message: 'You must be logged in to view your drop bookings.',
      });
    }

    const drops = await Drop.find({ email: req.user.email });

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

// Controller to delete a drop booking for the logged-in user
export const deleteDrop = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'fail',
        message: 'You must be logged in to delete a drop booking.',
      });
    }

    const { id } = req.params;

    const drop = await Drop.findOne({ _id: id, email: req.user.email });

    if (!drop) {
      return res.status(404).json({
        status: 'fail',
        message: 'Drop booking not found or you do not have permission to delete it.',
      });
    }

    await Drop.findByIdAndDelete(id);

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

// Controller to get drop details for the logged-in user
export const getUserDropDetails = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'fail',
        message: 'You must be logged in to view drop details.',
      });
    }

    const { email } = req.params;

    if (email !== req.user.email) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to view these drop details.',
      });
    }

    const userDrops = await Drop.find({ email });

    if (!userDrops || userDrops.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'No drop details found for this email',
      });
    }

    res.status(200).json({
      status: 'success',
      data: userDrops,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

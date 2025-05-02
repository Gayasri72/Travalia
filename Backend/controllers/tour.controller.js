import Tour from '../models/tour.model.js';
import APIFeatures from '../utills/apiFeatures.js';

export const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name, imageCover';
  next();
};

export const getAllTours = async (req, res) => {
  try {
    //execute query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limiting()
      .pagination();
    const tours = await features.query;

    //send response
    res.status(200).json({
      success: true,
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllToursAdmin = async (req, res) => {
  try {
    const tours = await Tour.find(); // Fetch all tours
    res.status(200).json({
      success: true,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      success: true,
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createTour = async (req, res) => {
  // Handle imageCover from upload.fields (multer)
  if (req.files && req.files.imageCover && req.files.imageCover[0]) {
    req.body.imageCover = req.files.imageCover[0].filename;
  }
  // Parse locations if sent as a string (from FormData)
  if (typeof req.body.locations === 'string') {
    try {
      req.body.locations = JSON.parse(req.body.locations);
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: 'Invalid locations format',
      });
    }
  }
  // Parse startDates if sent as a string (for FormData)
  if (typeof req.body.startDates === 'string') {
    try {
      req.body.startDates = JSON.parse(req.body.startDates);
    } catch (e) {
      req.body.startDates = [req.body.startDates];
    }
  }
  // Handle multiple gallery images
  if (req.files && req.files.images) {
    req.body.images = req.files.images.map((file) => file.filename);
  }
  // Parse guides if sent as a string (for FormData)
  if (typeof req.body.guides === 'string') {
    try {
      req.body.guides = JSON.parse(req.body.guides);
    } catch (e) {
      req.body.guides = [req.body.guides];
    }
  }
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json({
      success: true,
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      success: true,
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ]);
    res.status(200).json({
      success: true,
      data: {
        stats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTourStarts: -1 },
      },
    ]);
    res.status(200).json({
      success: true,
      data: {
        plan,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

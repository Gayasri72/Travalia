import bcrypt from 'bcryptjs';
import AppError from '../utills/error.js';
import User from '../models/user.model.js';

export const test = (req, res) => {
  res.json({ message: 'API is working' });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(new AppError('You are not allowed to update this user', 403));
  }

  try {
    const updateFields = {};

    if (req.body.password) {
      if (req.body.password.length < 6) {
        return next(new AppError('Password must be at least 6 characters', 400));
      }
      updateFields.password = bcrypt.hashSync(req.body.password, 10);
    }

    if (req.body.username) {
      if (req.body.username.length < 7 || req.body.username.length > 20) {
        return next(
          new AppError('Username must be between 7 and 20 characters', 400),
        );
      }
      if (req.body.username.includes(' ')) {
        return next(new AppError('Username cannot contain spaces', 400));
      }
      if (!/^[a-zA-Z0-9]+$/.test(req.body.username)) {
        return next(new AppError('Username can only contain letters and numbers', 400));
      }
      updateFields.username = req.body.username;
    }

    if (req.body.email) {
      updateFields.email = req.body.email;
    }

    if (req.body.profilePicture) {
      updateFields.profilePicture = req.body.profilePicture;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updateFields },
      { new: true },
    );

    if (!updatedUser) {
      return next(new AppError('User not found', 404));
    }

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {

  if (req.user.id !== req.params.userId) {
    return next(new AppError('you are not allowed to delete this user', 403));

  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json('User has been deleted');
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res
      .clearCookie('access_token')
      .status(200)
      .json('User has been signed out');
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to see all users'));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
    });
  } catch (error) {
    next(error);
  }
};


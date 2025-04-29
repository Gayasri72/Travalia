import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import AppError from '../utills/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username.trim() === '' ||
    email.trim() === '' ||
    password.trim() === ''
  ) {
    return next(new AppError('All fields are required', 400));
  }

  try {
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'Sign Up successfully' });
  } catch (error) {
    if (error.code === 11000) {
      return next(new AppError('Username or Email already exists', 400));
    }
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === '' || password === '') {
    return next(new AppError('All fields are required', 400));
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    const isPasswordMatch = bcryptjs.compareSync(password, user.password);

    if (!isPasswordMatch) {
      return next(new AppError('Invalid credentials', 400));
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      },
    );

    const { password: pass, ...rest } = user._doc;

    res
      .status(200)
      .cookie('access_token', token, {
        httpOnly: true,
        sameSite: 'lax', // or 'none' if using HTTPS
        secure: false, // true if using HTTPS
      })
      .json({ message: 'Login successful', rest });
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign(
        { id: user._id, email: user.email, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        {
          expiresIn: '1d',
        },
      );

      const { password: pass, ...rest } = user._doc;

      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json({ message: 'Login successful', rest });
    } else {
      const generaratedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generaratedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(' ').join('') +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, email: newUser.email, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET,
        {
          expiresIn: '1d',
        },
      );
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json({ message: 'Login successful', newUser });
    }
  } catch (error) {
    next(error);
  }
};

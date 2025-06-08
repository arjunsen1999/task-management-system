
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserModel } from '../models/user.model.js';

dotenv.config();

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const signup = async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;
    const userExists = await UserModel.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await UserModel.create({ email, password, name, role });
    return res.status(201).json({ token: generateToken(user), user });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    return res.status(200).json({ token: generateToken(user), user });
  } catch (err) {
    next(err);
  }
};

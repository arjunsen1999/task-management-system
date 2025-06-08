import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { TaskModel } from "../models/task.model.js";
import { UserModel } from "../models/user.model.js";

dotenv.config();

// Setup transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASSWORD,
  },
});

export const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await TaskModel.find()
      .populate("createdBy updatedBy", "email role")
      .sort("-updateAt -createAt");
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const task = await TaskModel.create({
      title,
      description,
      createdBy: req.user.id,
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { status, description } = req.body;
    const { id } = req.params;

    const task = await TaskModel.findByIdAndUpdate(
      id,
      { status, description, updatedBy: req.user.id },
      { new: true }
    );

    const user = await UserModel.findOne({ _id: req.user.id });

    // Notify Admin
    const adminUsers = await UserModel.find({ role: "admin" });

    if (adminUsers.length > 0) {
      const adminEmails = adminUsers.map((user) => user.email);

      await transporter.sendMail({
        from: process.env.ADMIN_EMAIL,
        to: adminEmails, // ✅ can be an array or comma-separated string
        subject: "Task Updated Notification",
        text: `A task "${task?.title}" has been updated by ${user?.email}.`,
      });
    }

    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    await TaskModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
};

export const getSingleTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await TaskModel.findById(id).populate("createdBy", "email name").populate("updatedBy", "email name");
    res.status(200).json({ task });
  } catch (error) {
    next(err);
  }
};

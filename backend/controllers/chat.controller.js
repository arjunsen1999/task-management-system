import { MessageModel } from "../models/message.model.js";

export const saveMessage = async (req, res, next) => {
  try {
    const { receiver, message } = req.body;

    const newMsg = await MessageModel.create({
      sender: req.user.id,
      receiver,
      message
    });

    res.status(201).json(newMsg);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const messages = await MessageModel.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

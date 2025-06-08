import express from 'express';
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  getSingleTask
} from '../controllers/task.controller.js';
import { verifyJWT, isAdmin, isUser } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', verifyJWT, getAllTasks);
router.post('/', verifyJWT, isAdmin, createTask);
router.put('/:id', verifyJWT, updateTask) // both Admin and User
router.get("/:id", verifyJWT, getSingleTask);
router.delete('/:id', verifyJWT, isAdmin, deleteTask);

export default router;

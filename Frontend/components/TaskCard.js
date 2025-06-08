"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Flag, Clock, CheckCircle, User, Trash2, View } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { updateTask } from "@/redux/slices/taskSlice";
import { useSelector } from "react-redux";
import {  useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Link from "next/link";

const deleteTaskById = async (id, token) => {
  const res = await fetch(`http://localhost:4000/api/v1/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete task");
  }

  return await res.json();
};

const statusStyles = {
  pending: {
    bg: "bg-yellow-100",
    text: "text-yellow-600",
    badge: "bg-yellow-500 text-white",
  },
  "in-progress": {
    bg: "bg-blue-100",
    text: "text-blue-600",
    badge: "bg-blue-500 text-white",
  },
  completed: {
    bg: "bg-green-100",
    text: "text-green-600",
    badge: "bg-green-500 text-white",
  },
};

export const updateTaskStatus = async (_id, status, token) => {
  const res = await fetch(`http://localhost:4000/api/v1/tasks/${_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Optional if protected
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error("Failed to update task");
  }

  return await res.json(); // Assumes updated task is returned
};

export default function TaskCard({ task, index }) {
  const [editingStatus, setEditingStatus] = useState(false);
  const [status, setStatus] = useState(task.status);
  const token = useSelector((state) => state.auth.token);
  const queryClient = useQueryClient();

  const isCompleted = status === "completed";
  const priority = task.priority || "medium";
  const statusStyle = statusStyles[status] || statusStyles.pending;

  const priorityIcons = {
    high: <Flag className="text-red-500" size={16} />,
    medium: <Flag className="text-yellow-500" size={16} />,
    low: <Flag className="text-green-500" size={16} />,
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    const _id = task?._id;

    try {
      // 1. Call the API
      const updated = await updateTaskStatus(_id, newStatus, token);

      // 2. Dispatch updated task to Redux
      // dispatch(updateTask(updated));
      queryClient.invalidateQueries(["tasks"]);
      // Optional: local state update (if needed)
      setEditingStatus(false);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

   const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTaskById(task._id, token);

      setTimeout(() =>{
  queryClient.invalidateQueries(["tasks"]); // Refetch if not using Redux
      }, 1000)
        toast.success("Task deleted");
      } catch (error) {
        console.error("Delete failed", error);
        toast.error("Failed to delete task");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      <Card
        className={`border-none shadow-md hover:shadow-lg transition-shadow duration-300 ${
          isCompleted ? "bg-gray-50" : "bg-white"
        }`}
      >
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${statusStyle.bg} ${statusStyle.text}`}
            >
              <CheckCircle size={16} />
            </div>
            <div className="space-y-1">
              <h3
                className={`font-medium text-gray-800 ${
                  isCompleted ? "line-through text-gray-400" : ""
                }`}
              >
                {task.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2">
                {task.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span className="text-sm">{task?.createdBy?.email}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Created by: {task?.createdBy?.email} (
                        {task?.createdBy?.role})
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {editingStatus ? (
              <select
                autoFocus
                value={status}
                onChange={handleStatusChange}
                onBlur={() => setEditingStatus(false)}
                className="text-sm rounded border border-gray-300 px-2 py-1 bg-white shadow"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            ) : (
              <Badge
                onClick={() => setEditingStatus(true)}
                className={`${statusStyle.badge} capitalize cursor-pointer`}
              >
                {status}
              </Badge>
            )}
            {priorityIcons[priority]}
          </div>

             <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Link href={`/dashboard/${task?._id}`}>
                  <View className="cursor-pointer" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Task</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          

           <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Trash2
                    className="text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                    size={18}
                    onClick={handleDelete}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete Task</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
        </CardContent>
      </Card>
    </motion.div>
  );
}

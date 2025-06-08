"use client";

import { motion } from "framer-motion";
import { Clock, User, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import axios from "axios";
import { decrypt } from "@/utils/crypto";
import ChatWithAdmin from "@/components/ChatWithAdmin";

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

// Fetch function using axios
const fetchTaskById = async (id, token) => {
  const res = await axios.get(`http://localhost:4000/api/v1/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const decryptData = decrypt(res?.data?.ciphertext);

  return decryptData?.task;
};

export default function TaskView() {
  const { id } = useParams();
  const router = useRouter();
  const token = useSelector((state) => state.auth.token);

  const {
    data: task,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["task", id],
    queryFn: () => fetchTaskById(id, token),
    enabled: !!id && !!token,
  });

  if (isLoading) return <p className="p-6">Loading task...</p>;
  if (isError || !task)
    return <p className="p-6 text-red-500">Error loading task</p>;

  const statusStyle = statusStyles[task.status] || statusStyles.pending;
  const createdAt = new Date(task.createdAt);
  const updatedAt = new Date(task.updatedAt);

  console.log("task", task);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto"
        >
          <h1 className="text-4xl font-bold mb-2">Task Details</h1>
          <p className="text-lg opacity-80">
            View and manage your task information
          </p>
        </motion.div>
        <div className="absolute inset-0 bg-grid-white/[0.1] bg-grid-16" />
      </div>

      {/* Task Content */}
      <div className="container mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-between">
                {task.title}
                <Badge className={`${statusStyle.badge} capitalize`}>
                  {task.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">
                  Description
                </h3>
                <p className="text-gray-600">{task.description}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">Status</h3>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${statusStyle.bg} ${statusStyle.text}`}
                  >
                    <CheckCircle size={16} />
                  </div>
                  <span className="capitalize text-gray-600">
                    {task.status}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">Created</h3>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={16} />
                  <span>{createdAt.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <User size={16} />
                  <span>
                    Created by: {task?.createdBy?.email || task?.createdBy?._id}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">
                  Last Updated
                </h3>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={16} />
                  <span>{updatedAt.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <User size={16} />
                  <span>
                    Updated by: {task?.updatedBy?.email || task?.updatedBy?._id}
                  </span>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <ChatWithAdmin adminId={task?.createdBy?._id} />
    </div>
  );
}

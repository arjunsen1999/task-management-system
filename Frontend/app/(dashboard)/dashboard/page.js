"use client";
import CreateTaskModal from "@/components/CreateTaskModal";
import TaskColumn from "@/components/TaskColumn";
import { setTasks } from "@/redux/slices/taskSlice";
import { decrypt } from "@/utils/crypto";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const fetchTasks = async (token) => {
  const response = await axios.get("http://localhost:4000/api/v1/tasks", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const decrypted = decrypt(response.data.ciphertext);
  return decrypted || []; // or adapt based on your actual structure
};

export default function Dashboard() {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => fetchTasks(token),
    enabled: !!token,
  });

  const userlogin = user ? (typeof user === 'object' ? user : JSON.parse(user)) : null;



  useEffect(() => {
    if (tasks.length > 0) dispatch(setTasks(tasks));
  }, [tasks, dispatch]);

  const statusCategories = ["pending", "in-progress", "completed"];

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
          <h1 className="text-4xl font-bold mb-2">Task Management Dashboard</h1>
          <p className="text-lg opacity-80">
            Organize, track, and complete your tasks with ease.
          </p>
        </motion.div>
        <div className="absolute inset-0 bg-grid-white/[0.1] bg-grid-16" />
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-between items-center mb-8"
        >
          <h2 className="text-2xl font-semibold text-gray-800">Your Tasks</h2>
          {userlogin && userlogin?.role == "admin" && <Button
            onClick={() => setShowModal(true)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
          >
            + Create Task
          </Button>}
        </motion.div>

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center h-64"
          >
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </motion.div>
        ) : (
          <motion.div
            className="flex items-start justify-start gap-6 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {statusCategories.map((status) => (
              <motion.div
                key={status}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="min-w-[700px]"
              >
                <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-4">
                    <TaskColumn status={status} />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CreateTaskModal onClose={() => setShowModal(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

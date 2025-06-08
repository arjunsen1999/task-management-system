"use client";

import { motion } from "framer-motion";
import { Mail, Lock, User } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/slices/authSlice";
import Cookies from "js-cookie";

import { useRouter } from "next/navigation";
import { encrypt, decrypt } from "@/utils/crypto";
import { toast } from "react-toastify";

export default function AuthForm({ type }) {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data) => {
      const encrypted = encrypt(data);
      const url =
        type === "login"
          ? "http://localhost:4000/api/v1/auth/login"
          : "http://localhost:4000/api/v1/auth/signup";
      const response = await axios.post(url, { ciphertext: encrypted });
      return decrypt(response.data.ciphertext);
    },
    onSuccess: (data) => {
      Cookies.set("token", data.token, { expires: 7 });
      Cookies.set("user", JSON.stringify(data.user), { expires: 7 });
      dispatch(loginSuccess(data));
      toast.success(`${type === "login" ? "Login" : "Signup"} successful!`);
      router.push("/dashboard");
    },
    onError: (error) => {
      if (error?.response?.data?.ciphertext) {
        const errorEn = decrypt(error?.response?.data?.ciphertext);

        if (errorEn?.message) {
          toast.error(errorEn?.message);
        } else {
          toast.error(`${type === "login" ? "Login" : "Signup"} failed!`);
        }
      } else {
        toast.error(`${type === "login" ? "Login" : "Signup"} failed!`);
      }
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark mb-2">
            {type === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-slate-500">
            {type === "login"
              ? "Log in to manage your tasks"
              : "Sign up to get started with TaskMaster"}
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {type === "signup" && (
            <>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-1"
              >
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    {...register("name")}
                    id="name"
                    type="text"
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="John Doe"
                  />
                </div>
              </motion.div>

              {/* Role Select Dropdown */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="space-y-1"
              >
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-slate-700"
                >
                  Role
                </label>
                <select
                  {...register("role")}
                  id="role"
                  className="block w-full py-2 px-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  defaultValue="user"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </motion.div>
            </>
          )}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: type === "login" ? 0.1 : 0.2 }}
            className="space-y-1"
          >
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                {...register("email")}
                id="email"
                type="email"
                required
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="you@example.com"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: type === "login" ? 0.2 : 0.3 }}
            className="space-y-1"
          >
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                {...register("password")}
                id="password"
                type="password"
                required
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="••••••••"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: type === "login" ? 0.4 : 0.5 }}
          >
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white cursor-pointer bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {type === "login" ? "Log In" : "Sign Up"}
            </button>
          </motion.div>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
        >
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">
                {type === "login"
                  ? "New to TaskMaster?"
                  : "Already have an account?"}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href={type === "login" ? "/signup" : "/login"}
              className="w-full flex justify-center py-2 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {type === "login" ? "Sign Up" : "Log In"}
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

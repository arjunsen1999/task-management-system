"use client"
import { Calendar, CheckCircle, Clock, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import TaskCard from '@/components/TaskCard';


export default function Home() {
  const tasks = [
    { id: 1, title: 'Complete project proposal', dueDate: '2023-06-15', priority: 'high', completed: false },
    { id: 2, title: 'Team meeting', dueDate: '2023-06-10', priority: 'medium', completed: true },
    { id: 3, title: 'Review code', dueDate: '2023-06-12', priority: 'low', completed: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-dark flex items-center gap-2"
          >
            <CheckCircle className="text-primary" /> TaskMaster
          </motion.h1>
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 rounded-lg text-dark hover:bg-slate-100 transition">
              Log In
            </Link>
            <Link 
              href="/signup" 
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition shadow-md"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-dark mb-6">
            Organize Your Work, <span className="text-primary">Simplify</span> Your Life
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            TaskMaster helps you stay on top of your tasks with intuitive features and beautiful design.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/signup" 
              className="px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition shadow-lg flex items-center gap-2"
            >
              Get Started <Plus size={18} />
            </Link>
            <Link 
              href="/login" 
              className="px-6 py-3 rounded-lg border border-primary text-primary hover:bg-slate-50 transition flex items-center gap-2"
            >
              Demo Login <Clock size={18} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="text-primary" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-dark mb-2">Task Management</h3>
            <p className="text-slate-600">Easily create, organize, and prioritize your tasks.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
              <Calendar className="text-secondary" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-dark mb-2">Deadline Tracking</h3>
            <p className="text-slate-600">Never miss a deadline with our intuitive calendar.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Clock className="text-primary" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-dark mb-2">Time Management</h3>
            <p className="text-slate-600">Track time spent on tasks for better productivity.</p>
          </div>
        </motion.div>
      </section>

      {/* Demo Tasks Section */}
      <section className="container mx-auto px-4 py-16 bg-white rounded-t-3xl shadow-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-dark mb-8 text-center">How It Works</h2>
          <div className="max-w-2xl mx-auto space-y-4">
            {tasks.map((task, index) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                index={index}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2023 TaskMaster. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
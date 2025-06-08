'use client';

import { useSelector } from 'react-redux';
import TaskCard from './TaskCard';

export default function TaskColumn({ status }) {
  const tasks = useSelector((state) => state?.task?.tasks);
  const filtered = tasks?.filter((task) => task.status === status);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">{status}</h2>
      <div className="space-y-4 min-h-[100px]">
        {filtered?.length > 0 ? (
          filtered?.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))
        ) : (
          <p className="text-sm text-gray-400 text-center">No tasks</p>
        )}
      </div>
    </div>
  );
}

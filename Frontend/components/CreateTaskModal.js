'use client';

import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { decrypt, encrypt } from '@/utils/crypto';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';

export default function CreateTaskModal({ onClose }) {
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const encrypted = encrypt(formData);
      const token = Cookies.get("token");
      const response = await axios.post(
        'http://localhost:4000/api/v1/tasks',
        { ciphertext: encrypted },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      onClose();
      reset();
    },
    onError : (error) =>{
      if (error?.response?.data?.ciphertext) {
            const errorEn = decrypt(error?.response?.data?.ciphertext);
  
    
            if (errorEn?.message) {
              toast.error(errorEn?.message);
            } else {
              toast.error(`Something Went Wrong`);
            }
          } else {
            toast.error(`Something Went Wrong`);
          }
    }
  });

  return (

    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Create New Task</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="space-y-6 mt-4"
        >
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">Title</Label>
            <Input
              id="title"
              {...register('title')}
              required
              className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter task title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              required
              className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
              placeholder="Enter task description"
            />
          </div>
        
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod';
import { clientAxios } from '@/lib/clientAxios';
import { useRouter } from 'next/navigation';

const formSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8)
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: 'Passwords do not match',
      path: ['confirmPassword']
    }
  );

type SignupData = z.infer<typeof formSchema>;

export const useSignup = () => {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: SignupData) => await clientAxios.post('/createuser', data),
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error creating user');
      }
      throw new Error('Error creating user');
    }
  });

  return { signup: mutate, isPending };
};

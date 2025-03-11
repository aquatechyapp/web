import { useMutation } from '@tanstack/react-query';
import axios, { isAxiosError } from 'axios';
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
    mutationFn: async (data: SignupData) => {
      try {
        const response = await clientAxios.post('/createuser', data);
        return response.data;
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 409) {
          throw new Error('User with this e-mail already exists.');
        }
        throw new Error('Error creating user');
      }
    }
  });

  return { signup: mutate, isPending };
};

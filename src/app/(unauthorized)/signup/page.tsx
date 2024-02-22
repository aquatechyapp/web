'use client';

import Link from 'next/link';

import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../../_components/InputField';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';
import StateAndCitySelect from '../../_components/StateAndCitySelect';
import { clientAxios } from '@/services/clientAxios';
import { useMutation } from '@tanstack/react-query';

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);
const formSchema = z
  .object({
    firstName: z.string().min(2, { message: 'First name is required' }),
    lastName: z.string().min(2, { message: 'Last name is required' }),
    phone: z.string().regex(phoneRegex, 'Phone number is required'),
    email: z.string().email({ message: 'Invalid email' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' }),
    confirmPassword: z.string().min(8, { message: 'Password is required' }),
    state: z.string().min(2, { message: 'State is required' }),
    city: z.string().min(2, { message: 'City is required' }),
    company: z.string().optional()
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

export default function Page() {
  const router = useRouter();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => await clientAxios.post('/createuser', data),
    onSuccess: ({ data }) => {
      router.push('/login');
      toast({
        variant: 'default',
        title: 'Success',
        description: 'User created successfully',
        className: 'bg-green-500'
      });
    },
    onError: (error) => {
      toast({
        variant: 'default',
        title: 'Internal error',
        description: 'Please try again later',
        className: 'bg-red-500 text-white'
      });
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      state: '',
      city: '',
      company: ''
    }
  });

  const handleSubmit = async (data) => {
    const phone = data.phone.replace(/\D/g, '').slice(1);
    const formattedData = {
      ...data,
      language: 'Portuguese',
      name: data.firstName + data.lastName,
      phone
    };
    mutate(formattedData);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="inline-flex w-[480px] flex-col items-start justify-start gap-[18px] rounded-lg bg-white px-6 py-8"
      >
        <div className="inline-flex h-5 items-center justify-center gap-3 self-stretch">
          <div className="shrink grow basis-0 self-stretch text-center text-2xl font-semibold leading-normal text-gray-600">
            Aquatechy
          </div>
        </div>
        <div className="relative h-[50px] w-[400px]">
          <div className="absolute left-0 top-0 h-[30px] w-[400px] text-xl font-semibold leading-[30px] tracking-tight text-neutral-800">
            Signup
          </div>
          <div className="absolute left-0 top-[30px] h-5 w-[400px]">
            <span className="text-sm font-medium leading-tight tracking-tight text-zinc-500">
              Already have an account?{' '}
            </span>
            <Link
              href="/login"
              className="text-sm font-bold leading-tight tracking-tight text-zinc-500"
            >
              Login
            </Link>
          </div>
        </div>
        <div className="inline-flex items-start justify-start gap-[18px] self-stretch">
          <InputField form={form} name="firstName" placeholder="First name" />
          <InputField form={form} name="lastName" placeholder="Last name" />
        </div>
        <InputField form={form} name="company" placeholder="Company" />
        <div className="inline-flex w-[432px] items-center justify-start gap-1">
          <InputField
            form={form}
            name="phone"
            placeholder="Phone number"
            type="phone"
          />
        </div>
        <InputField form={form} name="email" placeholder="E-mail address" />
        <StateAndCitySelect form={form} stateName="state" cityName="city" />
        <div className="inline-flex items-center justify-center gap-2 self-stretch ">
          <InputField
            form={form}
            name="password"
            placeholder="Password"
            type="password"
          />
        </div>
        <div className="inline-flex items-center justify-center gap-2 self-stretch ">
          <InputField
            form={form}
            name="confirmPassword"
            placeholder="Confirm password"
            type="password"
          />
        </div>
        <Button disabled={isPending} type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}

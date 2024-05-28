'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import imageIcon from '/public/images/logoHor.png';

import InputField from '../../../components/InputField';
import StateAndCitySelect from '../../../components/StateAndCitySelect';
import { Button } from '../../../components/ui/button';
import { Form } from '../../../components/ui/form';
import { useToast } from '../../../components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';

const formSchema = z
  .object({
    firstName: z.string().min(2, { message: 'First name is required' }),
    lastName: z.string().min(2, { message: 'Last name is required' }),
    phone: z
      .string({
        required_error: 'Phone is required.',
        invalid_type_error: 'Phone must be a string.'
      })
      .min(1, { message: 'Phone number is required.' }),
    email: z.string().email({ message: 'Invalid email' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    confirmPassword: z.string().min(8, { message: 'Password is required' }),
    address: z.string().min(2, { message: 'Address is required' }),
    zip: z.string().min(5, { message: 'Zip code is required' }),
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
        className: 'bg-red-500 text-gray-50'
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
    const formattedData = {
      ...data,
      language: 'Portuguese',
      name: data.firstName + data.lastName
    };
    mutate(formattedData);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="inline-flex w-[680px] flex-col items-start justify-start gap-[18px] overflow-scroll rounded-lg bg-gray-50 px-6 py-8"
      >
        <div className="inline-flex h-5 items-center justify-center gap-3 self-stretch">
          <Image src={imageIcon} alt="" width={250} height={0} />
        </div>
        <div className="relative h-[50px] w-[400px]">
          <div className="absolute left-0 top-0 h-[30px] w-[400px] text-xl font-semibold leading-[30px]  text-gray-800">
            Signup
          </div>
          <div className="absolute left-0 top-[30px] h-5 w-[400px]">
            <span className="text-sm font-medium   text-gray-500">Already have an account? </span>
            <Link href="/login" className="text-sm font-bold   text-gray-500">
              Login
            </Link>
          </div>
        </div>
        <div className="inline-flex items-start justify-start gap-[18px] self-stretch">
          <InputField form={form} name="firstName" placeholder="First name" />
          <InputField form={form} name="lastName" placeholder="Last name" />
          <InputField form={form} name="company" placeholder="Company" />
        </div>
        <div className="inline-flex items-start justify-start gap-[18px] self-stretch">
          <InputField form={form} name="email" placeholder="E-mail address" />
          <InputField form={form} name="phone" placeholder="Phone number" type="phone" />
        </div>
        <div className="inline-flex items-start justify-start gap-2 self-stretch ">
          <InputField form={form} name="address" placeholder="Address" />
          <InputField form={form} name="zip" placeholder="Zip" />
        </div>
        <StateAndCitySelect form={form} stateName="state" cityName="city" />
        <div className="inline-flex items-start justify-start gap-2 self-stretch ">
          <InputField form={form} name="password" placeholder="Password" type="password" />
          <InputField form={form} name="confirmPassword" placeholder="Confirm password" type="password" />
        </div>
        <Button disabled={isPending} type="submit" className="w-full">
          Signup
        </Button>
      </form>
    </Form>
  );
}

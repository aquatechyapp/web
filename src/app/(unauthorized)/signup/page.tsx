'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import imageIcon from '/public/images/logoHor.png';
import { defaultSchemas } from '@/schemas/defaultSchemas';
import { FieldType } from '@/ts/enums/enums';

import InputField from '../../../components/InputField';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../../../components/ui/dialog';
import { Form } from '../../../components/ui/form';
import { useToast } from '../../../components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';

const formSchema = z
  .object({
    email: defaultSchemas.email,
    password: defaultSchemas.password,
    confirmPassword: z.string().min(8, { message: 'Password is required' })
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
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);

  const { mutate: createUser, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => await clientAxios.post('/createuser', data),
    onSuccess: () => {
      setShowModal(true);
    },
    onError: (error) => {
      let errorMessage = 'Error';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || 'Error';
      }

      toast({
        duration: 5000,
        title: 'Error',
        description: errorMessage,
        variant: 'error'
      });
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const formattedData = {
      ...data
    };
    createUser(formattedData);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="inline-flex w-[680px] flex-col items-start justify-start gap-[18px] rounded-lg bg-gray-50 px-6 py-8"
      >
        <div className="mb-8 inline-flex h-5 items-center justify-center gap-3 self-stretch">
          <Image priority width="0" height="0" sizes="100vw" className="h-auto w-80" src={imageIcon} alt="Logo" />
        </div>
        <div className="relative mb-4 h-[50px] w-[400px]">
          <div className="absolute left-0 top-0 h-[30px] w-[400px] text-xl font-semibold leading-[30px] text-gray-800">
            Create your account
          </div>
          <div className="absolute left-0 top-[30px] h-5 w-[400px]">
            <span className="text-sm font-medium text-gray-500">Already have an account? </span>
            <Link href="/login" className="text-sm font-bold text-blue-500">
              Login
            </Link>
          </div>
        </div>

        <div className="mb-4 inline-flex flex-col items-start justify-start gap-[18px] self-stretch">
          <InputField label="E-mail" name="email" placeholder="E-mail address" />
          <InputField label="Password" name="password" placeholder="Password" type={FieldType.Password} />
          <InputField
            label="Confirm Password"
            name="confirmPassword"
            placeholder="Confirm password"
            type={FieldType.Password}
          />
        </div>

        <Button disabled={isPending} type="submit" className="w-full">
          Signup
        </Button>
      </form>
      {/* Modal de confirmação de email */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogTitle>Email Confirmation</DialogTitle>
          <DialogDescription className="text-center">
            An email has been sent to you. <br />
            Please check your e-mail to activate your account. <br />
            <b> If you can't find the e-mail, please check your spam box.</b>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </Form>
  );
}

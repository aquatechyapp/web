'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';
import imageIcon from '/public/images/logoHor.png';
import { defaultSchemas } from '@/schemas/defaultSchemas';
import { FieldType } from '@/ts/enums/enums';
import InputField from '../../../components/InputField';
import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '../../../components/ui/dialog';
import { Form } from '../../../components/ui/form';
import { useSignup } from '@/hooks/react-query/user/createUser';

const formSchema = z
  .object({
    email: defaultSchemas.email,
    password: defaultSchemas.password,
    confirmPassword: z.string().min(8, { message: 'Password must be at least 8 characters long.' })
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

type ModalState = {
  isOpen: boolean;
  type: 'success' | 'error';
  message: string;
};

export default function Page() {
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: 'success',
    message: ''
  });
  const { signup, isPending } = useSignup();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      signup(data);
      setModal({
        isOpen: true,
        type: 'success',
        message: 'User created successfully. Please check your email to confirm your account.'
      });
    } catch (error) {
      setModal({
        isOpen: true,
        type: 'error',
        message: error instanceof Error ? error.message : 'Error creating user'
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="inline-flex w-96 flex-col items-start justify-start gap-[18px] rounded-lg bg-gray-50 px-6 py-8 md:w-[680px]"
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

      <Dialog open={modal.isOpen} onOpenChange={(open) => setModal((prev) => ({ ...prev, isOpen: open }))}>
        <DialogContent className="w-96 rounded-md md:w-[680px]">
          <DialogHeader>
            <DialogTitle>{modal.type === 'success' ? 'Success' : 'Error'}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <p className="mt-4 text-left">
              {modal.type === 'success' ? (
                <span>
                  Please <b>check your e-mail</b> to activate your account, if you can't find the e-mail please check
                  your spam box.
                </span>
              ) : (
                modal.message
              )}
            </p>
          </DialogDescription>
          <DialogFooter className="mt-6">
            <Button
              onClick={() => {
                setModal((prev) => ({ ...prev, isOpen: false }));
                if (modal.type === 'success') {
                  window.location.href = '/login';
                }
              }}
            >
              {modal.type === 'success' ? 'Go to Login' : 'Close'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Form>
  );
}

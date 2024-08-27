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
import SelectField from '../../../components/SelectField';
import StateAndCitySelect from '../../../components/StateAndCitySelect';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../../../components/ui/dialog';
import { Form } from '../../../components/ui/form';
import { useToast } from '../../../components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';

const formSchema = z
  .object({
    firstName: defaultSchemas.name,
    lastName: defaultSchemas.name,
    phone: defaultSchemas.phone,
    email: defaultSchemas.email,
    password: defaultSchemas.password,
    confirmPassword: z.string().min(8, { message: 'Password is required' }),
    address: defaultSchemas.address,
    zip: defaultSchemas.zipCode,
    state: defaultSchemas.state,
    city: defaultSchemas.city,
    company: z.string().optional(),
    language: defaultSchemas.language
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
      toast({
        title: 'Success',
        description: 'User created successfully. Please check your email to confirm your account.',
        variant: 'success'
      });
    },
    onError: (error) => {
      let errorMessage = 'Internal error';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || 'Internal error';
      }

      toast({
        duration: 2000,
        title: 'Internal error',
        description: errorMessage,
        variant: 'error'
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
      company: '',
      language: 'English'
    }
  });

  const languageSelectOptions = ['English', 'Portuguese', 'Spanish'].map((lang) => ({
    value: lang,
    name: lang,
    key: lang
  }));

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const formattedData = {
      ...data,
      name: data.firstName + ' ' + data.lastName
    };
    createUser(formattedData);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="inline-flex w-[680px] flex-col items-start justify-start gap-[18px] rounded-lg bg-gray-50 px-6 py-8"
      >
        <div className="inline-flex h-5 items-center justify-center gap-3 self-stretch">
          <Image priority width="0" height="0" sizes="100vw" className="h-auto w-80" src={imageIcon} alt="Logo" />
        </div>
        <div className="relative h-[50px] w-[400px]">
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
        <div className="inline-flex items-start justify-start gap-[18px] self-stretch">
          <InputField name="firstName" placeholder="First name" />
          <InputField name="lastName" placeholder="Last name" />
          <InputField name="company" placeholder="Company" />
        </div>
        <div className="inline-flex items-start justify-start gap-[18px] self-stretch">
          <InputField name="email" placeholder="E-mail address" />
          <InputField name="phone" placeholder="Phone number" type={FieldType.Phone} />
          <SelectField options={languageSelectOptions} label="Language" name="language" placeholder="Language" />
        </div>
        <div className="inline-flex items-start justify-start gap-2 self-stretch">
          <InputField name="address" placeholder="Address" />
          <InputField name="zip" placeholder="Zip" type={FieldType.Zip} />
        </div>
        <StateAndCitySelect stateName="state" cityName="city" />
        <div className="inline-flex items-start justify-start gap-2 self-stretch">
          <InputField name="password" placeholder="Password" type={FieldType.Password} />
          <InputField name="confirmPassword" placeholder="Confirm password" type={FieldType.Password} />
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

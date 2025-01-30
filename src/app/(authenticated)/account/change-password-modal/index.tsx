import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import ConfirmActionDialog from '@/components/confirm-action-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { clientAxios } from '@/lib/clientAxios';
import { useMutation } from '@tanstack/react-query';
import { useUserStore } from '@/store/user';
import { AxiosError } from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { title } from 'process';

type ChangePasswordInput = typeof ChangePasswordSchema._input;
type ChangePasswordOutput = typeof ChangePasswordSchema._output;
const ChangePasswordSchema = z
  .object({
    id: z.string().optional(),
    currentPassword: z.string({ required_error: 'Password is required' }).min(1, { message: 'Password is required' }),
    newPassword: z
      .string({ required_error: 'New password is required' })
      .trim()
      .min(8, { message: 'New password must be at least 8 characters' }),
    newPasswordConfirmation: z
      .string({ required_error: 'New password confirmation is required' })
      .min(1, { message: 'New password confirmation is required' })
  })
  .refine((data) => data.newPassword === data.newPasswordConfirmation, {
    message: 'New password and new password confirmation do not match',
    path: ['newPasswordConfirmation']
  })
  .transform((data) => ({
    currentPassword: data.currentPassword,
    newPassword: data.newPassword
  }));

async function changePasswordFn(data: ChangePasswordOutput) {
  const response = await clientAxios.patch('users/password', data);
  return response;
}

const useChangePasswordService = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: changePasswordFn,
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Password updated successfully'
      });
    },
    onError: (
      error: AxiosError<{
        message: string;
      }>
    ) => {
      toast({
        variant: 'error',
        title: 'Error updating password',
        description: error.response?.data?.message ? error.response.data.message : 'Internal server error'
      });
    }
  });
};

const defaultValues: ChangePasswordInput = {
  currentPassword: '',
  newPassword: '',
  newPasswordConfirmation: ''
};

export default function ChangePasswordDialog() {
  const user = useUserStore((state) => state.user);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const changePasswordForm = useForm<ChangePasswordInput, any, ChangePasswordOutput>({
    defaultValues,
    resolver: zodResolver(ChangePasswordSchema)
  });

  const changePasswordService = useChangePasswordService();

  const handleOpenChange = (open: boolean) => {
    changePasswordForm.reset();
    setOpen(open);
  };
  const handleConfirmOpenChange = (open: boolean) => {
    setConfirmOpen(open);
  };

  const handleConfirmAction = async () => {
    try {
      const res = await changePasswordService.mutateAsync({
        ...changePasswordForm.getValues(),
        id: user.id
      } as any);

      if (res.status === 200) {
        handleOpenChange(false);
      }

      handleConfirmOpenChange(false);
    } catch (error) {
      handleConfirmOpenChange(false);
    }
  };

  const onSubmit = () => {
    setConfirmOpen(true);
  };

  return (
    <>
      <AlertDialog open={open} defaultOpen={open} onOpenChange={handleOpenChange}>
        <AlertDialogTrigger asChild>
          <Button variant="default" className="h-10 w-full">
            Change password
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change password</AlertDialogTitle>
            <AlertDialogDescription className="text-start">Change your account password</AlertDialogDescription>
          </AlertDialogHeader>
          <Form {...changePasswordForm}>
            <form onSubmit={changePasswordForm.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={changePasswordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current passowrd</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Your current password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={changePasswordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New passowrd</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="New password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={changePasswordForm.control}
                name="newPasswordConfirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm new passowrd</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <AlertDialogFooter className="pt-4">
                <Button type="submit" variant="default" size="default">
                  Change
                </Button>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="outline" size="default">
                    Close
                  </Button>
                </AlertDialogTrigger>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
      <ConfirmActionDialog open={confirmOpen} onConfirm={handleConfirmAction} onOpenChange={handleConfirmOpenChange} />
    </>
  );
}

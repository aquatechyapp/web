import { useMutation } from '@tanstack/react-query';
import { clientAxios } from '@/lib/clientAxios';
import { useToast } from '@/components/ui/use-toast';
import { AxiosError } from 'axios';

interface ResendServiceEmailRequest {
  serviceId: string;
}

interface ResendServiceEmailResponse {
  success: boolean;
  message: string;
}

const resendServiceEmail = async (data: ResendServiceEmailRequest): Promise<ResendServiceEmailResponse> => {
  const response = await clientAxios.post('/services/resend-email', data);
  return response.data;
};

export const useResendServiceEmail = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: resendServiceEmail,
    onSuccess: () => {
      toast({
        duration: 5000,
        title: 'Email resent successfully',
        variant: 'success'
      });
      // You can add success handling here if needed
    },
    onError: (error: AxiosError<{
      message: string;
    }>) => {
      // Check if the error is a 403 and the message is "Subscription not allowed."
      if (error.response?.status === 403 && error.response?.data?.message === 'Subscription not allowed.') {
        toast({
          duration: 5000,
          title: 'Subscription not allowed',
          variant: 'error',
          description: 'Please upgrade your subscription to resend emails.'
        });
      } else {
        toast({
          duration: 5000,
          title: 'Error resending service email',
          variant: 'error',
          description: error.response?.data?.message ? error.response.data.message : 'Internal server error'
        });
      }
    }
  });
};

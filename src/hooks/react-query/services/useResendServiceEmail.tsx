import { useMutation } from '@tanstack/react-query';
import { clientAxios } from '@/lib/clientAxios';

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
  return useMutation({
    mutationFn: resendServiceEmail,
    onSuccess: () => {
      // You can add success handling here if needed
    },
    onError: (error) => {
      console.error('Error resending service email:', error);
    }
  });
};

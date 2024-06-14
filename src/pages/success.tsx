import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const SuccessPage = () => {
  const router = useRouter();
  const { session_id } = router.query;

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      try {
        const { data } = await axios.get(`/api/checkout_session?session_id=${session_id}`);
        console.log(data);
      } catch (error) {
        console.error('Error fetching payment info:', error);
      }
    };

    if (session_id) {
      fetchPaymentInfo();
    }
  }, [session_id]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-4 text-center text-3xl font-bold text-green-500">Pagamento Concluído com Sucesso!</h1>
        <button
          className="mt-6 w-full rounded bg-blue-500 py-2 text-white transition-colors hover:bg-blue-600"
          onClick={() => router.push('/payment')}
        >
          Voltar
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;

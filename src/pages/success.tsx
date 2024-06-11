import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const SuccessPage = () => {
  const router = useRouter();
  const { session_id } = router.query;
  const [paymentInfo, setPaymentInfo] = useState<any>(null);

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      try {
        const { data } = await axios.get(`/api/checkout_session?session_id=${session_id}`);
        setPaymentInfo(data);
      } catch (error) {
        console.error('Error fetching payment info:', error);
      }
    };

    if (session_id) {
      fetchPaymentInfo();
    }
  }, [session_id]);

  return (
    <div>
      <h1>Pagamento Concluído com Sucesso!</h1>
      <p>Detalhes do pagamento:</p>
      {paymentInfo && (
        <div>
          <p>Status: {paymentInfo.payment_status}</p>
          <p>Customer Name: {paymentInfo.customer_name}</p>
          <p>Customer Email: {paymentInfo.customer_email}</p>
        </div>
      )}
    </div>
  );
};

export default SuccessPage;

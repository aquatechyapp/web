'use client';

import axios from 'axios';
import React, { useState } from 'react';

import { useUserContext } from '@/context/user';

export default function Payment() {
  const [loading, setLoading] = useState(false);
  const { user } = useUserContext();

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/checkout_sessions', {
        customerInfo: {
          email: user?.email,
          name: user?.firstName,
          address: user?.address,
          price: 1000
        },
        productInfo: {
          name: 'Product Name', // Nome do produto
          description: 'Product Description', // Descrição do produto
          price: 1000 // Valor em centavos (1000 = R$ 10,00)
        }
      });

      // Redireciona para a página de checkout do Stripe
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      // Trate o erro aqui, se necessário
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleCheckout} disabled={loading}>
        {loading ? 'Loading...' : 'Checkout'}
      </button>
    </div>
  );
}

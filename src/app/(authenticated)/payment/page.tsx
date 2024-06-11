'use client';

import axios from 'axios';
import React, { useState } from 'react';

export default function Payment() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/checkout_sessions', {
        customerInfo: {
          email: 'customer@example.com', // Substitua pelo email do cliente
          name: 'John Doe', // Substitua pelo nome do cliente
          address: '123 Street, City' // Substitua pelo endereço do cliente
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

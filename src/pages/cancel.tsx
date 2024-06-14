import React from 'react';

const CancelPage = () => {
  return (
    <div>
      <h1>Pagamento Cancelado!</h1>
      <p>O pagamento foi cancelado pelo cliente.</p>
      <button
        className="mt-6 w-full rounded bg-blue-500 py-2 text-white transition-colors hover:bg-blue-600"
        onClick={() => router.push('/payment')}
      >
        Voltar
      </button>
    </div>
  );
};

export default CancelPage;

// pages/api/create_checkout_session.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('Stripe secret key not found in environment variables');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-04-10'
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { customerInfo, productInfo } = req.body;

    try {
      // Verifica se os dados necessários foram fornecidos
      if (!customerInfo?.email || !customerInfo?.name || !customerInfo?.address) {
        throw new Error('Missing required customer information');
      }

      if (!productInfo?.name || !productInfo?.description || !productInfo?.price) {
        throw new Error('Missing required product information');
      }

      // Cria uma sessão de Checkout usando um preço fixo
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'brl',
              product_data: {
                name: productInfo.name,
                description: productInfo.description
              },
              unit_amount: productInfo.price
            },
            quantity: 1
          }
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/success?success=true`,
        cancel_url: `${req.headers.origin}/cancel?canceled=true`,
        customer_email: customerInfo.email,
        metadata: {
          customer_name: customerInfo.name,
          customer_address: customerInfo.address
        }
      });

      // Retorna a URL da sessão para o cliente
      res.status(200).json({ url: session.url });
    } catch (err) {
      console.error('Error creating checkout session:', err);
      res.status(500).json({ error: 'Failed to create checkout session' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default handler;

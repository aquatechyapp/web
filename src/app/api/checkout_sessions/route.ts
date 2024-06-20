import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('Stripe secret key not found in environment variables');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-04-10'
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { customerInfo, productInfo } = body;

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
      // payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productInfo.name,
              description: 'Not'
            },
            unit_amount: productInfo.price
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${req.nextUrl.origin}/invoices?success=true`,
      cancel_url: `${req.nextUrl.origin}/invoices?canceled=true`,
      metadata: {
        customer_name: customerInfo.name,
        customer_address: customerInfo.address,
        invoice_id: customerInfo.id
      }
    });

    // Retorna a URL da sessão para o cliente
    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}

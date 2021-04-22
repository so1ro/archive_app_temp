import { stripe } from '@/utils/stripe';
import { getURL } from '@/utils/helpers';
import { NextApiRequest, NextApiResponse } from 'next'

const checkSession = async (req: NextApiRequest, res: NextApiResponse) => {
  const { session_id }: { session_id: string } = JSON.parse(req.body);

  if (req.method === 'POST') {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      const customer = await stripe.customers.retrieve(session.customer);
      const subscriptionDetail = await stripe.prices.retrieve(customer.metadata.price_Id);
      const isSubscribing = subscriptionDetail.active

      return res.status(200).json({
        customer_email: customer.email,
        customer_auth0_UUID: customer.metadata.auth0_UUID,
        customer_price_Id: customer.metadata.price_Id,
        isSubscribing
      });

    } catch (e) {
      res.status(400);
      return res.send({
        error: {
          message: e.message,
        }
      });
    }


  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default checkSession;

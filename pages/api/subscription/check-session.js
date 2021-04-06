import { stripe } from '@/utils/stripe';
import { getURL } from '@/utils/helpers';

const checkSession = async (req, res) => {
  const { session_id } = JSON.parse(req.body);
  console.log('session_id_CHECK-SESSION:', session_id)

  if (req.method === 'POST') {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      const customer = await stripe.customers.retrieve(session.customer);
      console.log('customer:', customer)

      return res.status(200).json({
        customer_email: customer.email,
        customer_auth0UUID: customer.metadata.auth0UUID,
        customer_priceId: customer.metadata.priceId
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
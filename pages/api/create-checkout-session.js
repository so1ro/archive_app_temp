import { stripe } from '@/utils/stripe';
import { getURL } from '@/utils/helpers';
import { parseJSON } from 'date-fns';

const domain = process.env.NEXT_PUBLIC_DOMAIN

// import { getUser } from '@/utils/supabase-admin';
// import { createOrRetrieveCustomer } from '@/utils/useDatabase';

const createCheckoutSession = async (req, res) => {
  const { price } = JSON.parse(req.body);

  if (req.method === 'POST') {
    // See https://stripe.com/docs/api/checkout/sessions/create
    // for additional parameters to pass.
    try {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        // billing_address_collection: 'required',
        // customer,
        line_items: [
          {
            price,
            quantity: 1
          }
        ],
        allow_promotion_codes: true,
        subscription_data: {
          trial_from_plan: true,
          // metadata
        },
        success_url: `${domain}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${domain}`
      });
      return res.status(200).json({ sessionId: session.id });

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




  //// nextjs-subscription-payments ////
  // if (req.method === 'POST') {
  //   const token = req.headers.token;
  //   const { price, quantity = 1, metadata = {} } = req.body;

  //   try {
  //     const user = await getUser(token);
  //     const customer = await createOrRetrieveCustomer({
  //       uuid: user.id,
  //       email: user.email
  //     });

  //     const session = await stripe.checkout.sessions.create({
  //       payment_method_types: ['card'],
  //       billing_address_collection: 'required',
  //       customer,
  //       line_items: [
  //         {
  //           price,
  //           quantity
  //         }
  //       ],
  //       mode: 'subscription',
  //       allow_promotion_codes: true,
  //       subscription_data: {
  //         trial_from_plan: true,
  //         metadata
  //       },
  //       success_url: `${getURL()}/account`,
  //       cancel_url: `${getURL()}/`
  //     });

  //     return res.status(200).json({ sessionId: session.id });
  //   } catch (err) {
  //     console.log(err);
  //     res
  //       .status(500)
  //       .json({ error: { statusCode: 500, message: err.message } });
  //   }
  // } else {
  //   res.setHeader('Allow', 'POST');
  //   res.status(405).end('Method Not Allowed');

};

export default createCheckoutSession;

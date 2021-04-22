import { stripe } from '@/utils/stripe';
import { getURL } from '@/utils/helpers';
import { parseJSON } from 'date-fns';
import { NextApiRequest, NextApiResponse } from 'next'

const domain = process.env.NEXT_PUBLIC_DOMAIN

const createCheckoutSession = async (req: NextApiRequest, res: NextApiResponse) => {
  const { price, user_uuid, user_email }:
    { price: string, user_uuid: string, user_email: string } = JSON.parse(req.body);

  if (req.method === 'POST') {
    // See https://stripe.com/docs/api/checkout/sessions/create
    // for additional parameters to pass.
    try {
      const customerData: {
        email: string | null,
        metadata: object | null
      } = {
        email: null,
        metadata: {
          price_Id: price,
          auth0_UUID: user_uuid
        }
      };
      if (user_email) customerData.email = user_email;
      const customer = await stripe.customers.create(customerData)

      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        // billing_address_collection: 'required',
        customer: customer.id,
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
        success_url: `${domain}/account/?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${domain}/account/`
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

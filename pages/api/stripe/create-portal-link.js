import { stripe } from '@/utils/stripe';

const domain = process.env.NEXT_PUBLIC_DOMAIN

const createPortalLink = async (req, res) => {
  if (req.method === 'POST') {
    const { customer_Id } = JSON.parse(req.body);

    try {
      const { url } = await stripe.billingPortal.sessions.create({
        customer: customer_Id,
        return_url: `${domain}/account`
      });

      return res.status(200).json({ url });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default createPortalLink;

import { stripe } from '@/utils/stripe';

const getPriceList = async (req, res) => {
  try {
    const products = await stripe.prices.list();
    const subscriptionPlans = products.data
      .filter(prod => prod.recurring?.interval === 'month')
      .sort((a, b) => a.unit_amount - b.unit_amount)

    return res.status(200).json({ subscriptionPlans });

  } catch (e) {
    res.status(400);
    return res.send({
      error: {
        message: e.message,
      }
    });
  }


}

export default getPriceList;

import { loadStripe } from '@stripe/stripe-js';

let stripePromise;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      'pk_test_23mTWmoV7pLYhDYjO5U7n8Yz00hHTBEmHB'
      // process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE ??
      //   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    );
  }

  return stripePromise;
};

import Stripe from 'stripe';
export const stripe = Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY)
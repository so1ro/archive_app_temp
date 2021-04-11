import { stripe } from '@/utils/stripe';

export async function fetchSubscriptionPlans() {
    // add a try / catch loop for nicer error handling
    try {
        const products = await stripe.prices.list();
        const subscriptionPlans = products.data
            .filter(prod => prod.recurring?.interval === 'month')
            .sort((a, b) => a.unit_amount - b.unit_amount)

        // const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/stripe/get-price-list`)
        // const { subscriptionPlans } = await res.json()

        return {
            props: {
                subscriptionPlans
            },
            revalidate: 60
        }
    } catch (error) {
        // add a descriptive error message first,
        console.error(`There was a problem retrieving Subscription Plans`);
        console.error(error);
    }
}

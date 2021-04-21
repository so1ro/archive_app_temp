import { stripe } from '@/utils/stripe';
import _ from 'lodash'

export async function fetchSubscriptionPlans() {
    // add a try / catch loop for nicer error handling
    try {
        const products = await stripe.prices.list();
        const subscriptionPlans = products.data
            .filter(prod => prod.type === 'recurring')
            .filter(prod => prod.nickname)
            .map(prod => _.pick(prod, ['id', 'nickname']))
            .sort((a, b) => a.unit_amount - b.unit_amount)

        // const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/stripe/get-price-list`)
        // const { subscriptionPlans } = await res.json()

        return {
            props: {
                subscriptionPlans
            },
            revalidate: 30
        }
    } catch (error) {
        // add a descriptive error message first,
        console.error(`There was a problem retrieving Subscription Plans`);
        console.error(error);
    }
}

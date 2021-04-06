export async function fetchSubscriptionPlans() {
    // add a try / catch loop for nicer error handling
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}api/subscription/get-price-list`)
        const { subscriptionPlans } = await res.json()

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

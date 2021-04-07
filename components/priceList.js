import { useState, useEffect } from 'react';
import Head from 'next/head'

import { Button } from '@chakra-ui/react'
import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';

export default function PriceList({ user, subscriptionPlans }) {

    const handleCheckout = async (price) => {
        // setPriceIdLoading(price.id);

        try {
            const { sessionId } = await postData({
                url: '/api/stripe/create-checkout-session',
                data: {
                    price,
                    user_uuid: user.sub,
                    user_email: user.email
                }
                // token: session.access_token
            });

            const stripe = await getStripe();
            stripe.redirectToCheckout({ sessionId });
        } catch (error) {
            return alert(error.message);
        } finally {
            // setPriceIdLoading(false);
        }
    };
    //

    return (
        <div>
            {subscriptionPlans.map(plan => (
                <Button key={plan.id} onClick={() => handleCheckout(plan.id)}>{plan.nickname}</Button>
            ))}
        </div>
    );
};


import { useState, useEffect } from 'react';
import Head from 'next/head'

import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';

import { Button, useToast } from '@chakra-ui/react'

export default function PriceList(
    { user, subscriptionPlans }: { user: object, subscriptionPlans: subscriptionPlanInterface }) {

    const toast = useToast()

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
                <Button key={plan.id} onClick={() => {
                    toast({
                        title: "チェックアウトセッションに移動中...",
                        description: "このまま少々お待ち下さい。",
                        status: "success",
                        duration: 9000,
                        isClosable: true,
                    })
                    handleCheckout(plan.id)
                }}
                >{plan.nickname}</Button>
            ))}
        </div>
    );
};


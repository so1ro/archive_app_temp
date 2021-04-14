import { useState, useEffect } from 'react';
import Head from 'next/head'

import { useUser } from '@auth0/nextjs-auth0'
import { useUserMetadata } from '@/context/useUserMetadata';
import { fetchSubscriptionPlans } from '@/hook/getStaticProps';
import { postData } from '@/utils/helpers';
import PriceList from '@/components/priceList';

import {
  Button,
  Code
} from '@chakra-ui/react';
import styles from '@/styles/Home.module.css'

export default function Account({ subscriptionPlans }) {
  const { user, error, isLoading } = useUser();
  const {
    User_Detail,
    Stripe_Customer_Detail,
    error_metadata,
    isLoading_metadata,
    isBeforeCancelDate,
  } = useUserMetadata()

  // useEffect
  // useEffect(() => {
  // }, [])

  // Function
  const handleCustomerPortal = async (customer_Id) => {
    const { url, error } = await postData({
      url: '/api/stripe/create-portal-link',
      data: { customer_Id }
    });
    if (error) return alert(error.message);
    window.location.assign(url);
  }

  // Render
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    return (
      <div className={styles.container}>
        <div>Welcome {user.name}! <a href="/api/auth/logout">Logout</a></div>
        {!isLoading_metadata &&
          <>
            {Stripe_Customer_Detail?.cancel_at_period_end &&
              <Code>
                {`サブスクリプションは、${Stripe_Customer_Detail.cancel_at}` +
                  (isBeforeCancelDate ? `にキャンセルされます。` : `にキャンセルされました。`)}
              </Code>}
            {Stripe_Customer_Detail?.subscription_Status &&
              <Button onClick={() => handleCustomerPortal(Stripe_Customer_Detail.customer_Id)}>
                {!Stripe_Customer_Detail.cancel_at_period_end ? `プランの変更 ／ キャンセル ／ その他詳細` : `サブスクリプションの再開 ／ その他詳細`}
              </Button>}
            {!Stripe_Customer_Detail?.subscription_Status &&
              <PriceList user={user} subscriptionPlans={subscriptionPlans} />}
          </>
        }
      </div>
    )
  }
  return <a href="/api/auth/login">Login</a>;
}

export async function getStaticProps() {
  // get Subscription Plans from Stripe
  return await fetchSubscriptionPlans()
}



import { useState, useEffect } from 'react';
import Head from 'next/head'
import { GetStaticProps } from "next"

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

export default function Account({ subscriptionPlans }: { subscriptionPlans: SubscriptionPlanInterface[] }) {
  // export default function Account({ subscriptionPlans }) {
  const { user, error, isLoading } = useUser();
  const {
    User_Detail,
    Stripe_Customer_Detail,
    error_metadata,
    isLoading_metadata,
    isBeforeCancelDate,
    temporaryCheckIsSubscribing,
    setTemporaryCheckIsSubscribing,
  }: UserMetadataContextInterface = useUserMetadata()

  // useEffect
  useEffect(() => {
    if (user && typeof window !== 'undefined' && window.location.search.indexOf('session_id') > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      const session_id = urlParams.get('session_id');
      const checkSession = async () => {
        const customerData: CustomerDataInterface = await postData({
          url: '/api/stripe/check-session',
          data: { session_id }
        }).then(data => data)

        if (customerData.customer_email === user.email) {
          setTemporaryCheckIsSubscribing({ temporaryCheckIsSubscribing: customerData.isSubscribing })
        }
      }
      checkSession();
    }

  }, [user])

  // Function
  const handleCustomerPortal = async (customer_Id: string) => {
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
                  (isBeforeCancelDate ? `までご利用いただけます。` : `にキャンセルされました。`)}
              </Code>}
            {(Stripe_Customer_Detail?.subscription_Status || temporaryCheckIsSubscribing)
              && Stripe_Customer_Detail?.subscription_Status !== 'canceled'
              && <Button onClick={() => handleCustomerPortal(Stripe_Customer_Detail.customer_Id)}>
                {!Stripe_Customer_Detail.cancel_at_period_end ?
                  `プランの変更・キャンセル ／ 過去のお支払い履歴` : `サブスクリプションの再開 ／ 過去のお支払い履歴`}
              </Button>}
            {(!Stripe_Customer_Detail?.subscription_Status && !temporaryCheckIsSubscribing)
              || Stripe_Customer_Detail?.subscription_Status === 'canceled'
              && <PriceList user={user} subscriptionPlans={subscriptionPlans} />}
          </>
        }
      </div>
    )
  }
  return <a href="/api/auth/login">Login</a>;
}

export const getStaticProps: GetStaticProps = async () => {
  // get Subscription Plans from Stripe
  return await fetchSubscriptionPlans()
}



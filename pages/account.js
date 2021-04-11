import { useState, useEffect } from 'react';
import Head from 'next/head'
import styles from '@/styles/Home.module.css'

import { useUser } from '@auth0/nextjs-auth0'
import { fetchSubscriptionPlans } from '@/hook/getStaticProps';
import { postData } from '@/utils/helpers';

import PriceList from '@/components/priceList';
import { Button } from '@chakra-ui/react';

export default function Account({ subscriptionPlans }) {
  const { user, error, isLoading } = useUser();
  const [{ Stripe_Customer_Detail }, setStripeCustomerDetail] = useState({ Stripe_Customer_Detail: undefined })

  //useEffect
  useEffect(() => {
    if (user) {
      const getUserMetadata = async () => {
        const { user_metadata: { Stripe_Customer_Detail } } = await postData({
          url: '/api/auth/fetch-user-metadata',
          data: { user_id: user.sub }
        }).then(data => data)

        setStripeCustomerDetail({ Stripe_Customer_Detail })
      }
      getUserMetadata();
    }
  }, [user])

  //Function
  const handleCustomerPortal = async (customerId) => {
    const { url, error } = await postData({
      url: '/api/stripe/create-portal-link',
      data: { customerId }
    });
    if (error) return alert(error.message);
    window.location.assign(url);
  }

  //Render
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <div>
            Welcome {user.name}! <a href="/api/auth/logout">Logout</a>
          </div>
          <PriceList user={user} subscriptionPlans={subscriptionPlans} />
          <Button onClick={() => handleCustomerPortal(Stripe_Customer_Detail.customerId)}>
            プランの変更／キャンセル
          </Button>

        </main>
      </div>
    )
  }
  return <a href="/api/auth/login">Login</a>;

}

export async function getStaticProps() {
  // get Subscription Plans from Stripe
  return await fetchSubscriptionPlans()
}



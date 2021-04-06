import { useState, useEffect } from 'react';
import Head from 'next/head'
import styles from '@/styles/Home.module.css'

import { useUser } from '@auth0/nextjs-auth0'
import { fetchSubscriptionPlans } from '@/hook/subscriptionPlans';

import { Button } from '@chakra-ui/react'
import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';
import PriceList from '@/components/priceList';

export default function Account({ subscriptionPlans }) {

  console.log('subscriptionPlans:', subscriptionPlans)
  const { user, error, isLoading } = useUser();
  const [{ checkSessionEmail }, setCheckSessionEmail] = useState({ checkSessionEmail: '' })
  const [{ subscription }, setSubscription] = useState({ subscription: undefined })

  useEffect(() => {

  }, [])

  useEffect(() => {
    if (user) {
      setSubscription({ subscription: user?.metadata?.subscription })
    }

    if (user && typeof window !== 'undefined' && window.location.search.indexOf('session_id') > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      const session_id = urlParams.get('session_id');

      const checkSession = async () => {
        const customerData = await postData({
          url: '/api/subscription/check-session',
          data: { session_id }
        }).then(data => data)
        await customerData.customer_email === user.email ? console.log('True') : console.log('false')
      }
      checkSession();
    }
  }, [user])

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

        </main>
      </div>
    )
  }
  return <a href="/api/auth/login">Login</a>;

}

export async function getStaticProps() {
  // get Subscription Plans from Stripe
  return fetchSubscriptionPlans()
}



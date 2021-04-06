import { useState, useEffect } from 'react';
import Head from 'next/head'
import styles from '@/styles/Home.module.css'

import { useUser } from '@auth0/nextjs-auth0'
import { fetchSubscriptionPlans } from '@/hook/subscriptionPlans';

import PriceList from '@/components/priceList';

export default function Account({ subscriptionPlans }) {

  console.log('subscriptionPlans:', subscriptionPlans)
  const { user, error, isLoading } = useUser();
  // const [{ checkSessionEmail }, setCheckSessionEmail] = useState({ checkSessionEmail: '' })

  useEffect(() => {
  }, [])

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



import { useState, useEffect } from 'react';
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import { useUser } from '@auth0/nextjs-auth0'

import { Button } from '@chakra-ui/react'
import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';

export default function Account({ subscriptionPlans }) {

  // Contextに入れる！！！！！！！！！！！！！
  console.log('subscriptionPlans:', subscriptionPlans)
  // Contextに入れる！！！！！！！！！！！！！

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

  //

  const handleCheckout = async (price) => {
    // setPriceIdLoading(price.id);
    // if (!session) {
    //   return router.push('/signin');
    // }
    // if (subscription) {
    //   return router.push('/account');
    // }

    try {
      const { sessionId } = await postData({
        url: '/api/subscription/create-checkout-session',
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <div>
            Welcome {user.name}! <a href="/api/auth/logout">Logout</a>
          </div>
          <Button onClick={() => handleCheckout(subscriptionPlans[0].id)}>Subscription</Button>

        </main>
      </div>
    )
  }
  return <a href="/api/auth/login">Login</a>;

}

export async function getStaticProps() {
  // get Subscription Plans from Stripe
  const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}api/subscription/get-price-list`)
  const { subscriptionPlans } = await res.json()

  return {
    props: {
      subscriptionPlans
    },
    revalidate: 60
  }
}



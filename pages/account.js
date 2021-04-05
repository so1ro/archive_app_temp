import { useState, useEffect } from 'react';
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import { stripe } from '@/utils/stripe';
import { useUser } from '@auth0/nextjs-auth0'

import { Button } from '@chakra-ui/react'
import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';

export default function Account({ subscriptionPlans }) {
  console.log('subscriptionPlans:', subscriptionPlans)

  const { user, error, isLoading } = useUser();
  const [{ checkSessionEmail }, setCheckSessionEmail] = useState({ checkSessionEmail: '' })
  const [{ subscription }, setSubscription] = useState({ subscription: undefined })
  const [{ userData }, setUserData] = useState({ userData: undefined })

  useEffect(() => {

  }, [])

  useEffect(() => {
    if (user) {
      setUserData({ userData: user })
      setSubscription({ subscription: user?.metadata?.subscription })
    }

    if (user && typeof window !== 'undefined' && window.location.search.indexOf('session_id') > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      const session_id = urlParams.get('session_id');

      const checkSession = async () => {
        console.log(userData);
        const checkEmail = await postData({
          url: '/api/subscripe/check-session',
          data: { session_id }
        }).then(data => data.customer_email)
        await checkEmail === user.email ? console.log('True') : console.log('false')
        console.log('checkEmail:', checkEmail)
      }
      checkSession();
    }
  }, [user])

  //
  console.log('user:', user)
  // console.log('user.sub:', user.sub)

  const handleCheckout = async (price) => {
    // setPriceIdLoading(price.id);
    // if (!session) {
    //   return router.push('/signin');
    // }
    // if (subscription) {
    //   return router.push('/account');
    // }

    try {
      console.log('YesWorking!!!!!!');
      const { sessionId } = await postData({
        url: '/api/subscripe/create-checkout-session',
        data: {
          price,
          user_uuid: userData.sub,
          user_email: userData.email
        }
        // token: session.access_token
      });
      console.log('sessionId:', sessionId)

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
          <Button onClick={() => handleCheckout('price_1IbzbvF2cZ3hGzdma5SsXd3X')}>Subscription</Button>

        </main>
      </div>
    )
  }
  return <a href="/api/auth/login">Login</a>;

}

export async function getStaticProps() {
  const products = await stripe.prices.list();
  const subscriptionPlans = products.data
    .filter(prod => prod.recurring?.interval === 'month')
    .sort((a, b) => a.unit_amount - b.unit_amount)

  return {
    props: {
      subscriptionPlans
    },
    revalidate: 60
  };
}



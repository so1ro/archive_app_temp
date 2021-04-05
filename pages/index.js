import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useUser } from '@auth0/nextjs-auth0'
import { Button } from '@chakra-ui/react'
import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';

export default function Home() {
  const { user, error, isLoading } = useUser();

  //
  console.log('user:', user)
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
        url: '/api/create-checkout-session',
        data: { price },
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

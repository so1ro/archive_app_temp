import { useState, useEffect } from 'react';
import { GetStaticProps } from "next"

import { useUser } from '@auth0/nextjs-auth0'
import { useUserMetadata } from '@/context/useUserMetadata';
import { fetchAllPrices } from '@/hook/getStaticProps';
import { postData } from '@/utils/helpers';
import PriceList from '@/components/PriceList';
import { fetchContentful } from '@/hook/contentful';
import { query_archivePricing } from '@/hook/contentful-queries';

import { Button, Code } from '@chakra-ui/react';
import PageShell from '@/components/PageShell';

export default function Account({ allPrices, landingPageText }: { allPrices: AllPrices[], landingPageText: LandingPageText[], }) {

  const { user, error, isLoading } = useUser();
  const {
    User_Detail,
    subscription_state,
    Stripe_Customer_Detail,
    error_metadata,
    isBeforeCancelDate,
    temporaryCheckIsSubscribing,
    setTemporaryCheckIsSubscribing,
  }: UserMetadataContextInterface = useUserMetadata()

  const { annotation } = landingPageText[0]

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
      <PageShell customPY={null}>
        {(subscription_state === 'subscribe') &&
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
          </>
        }
        {((subscription_state === 'unsubscribe' && !temporaryCheckIsSubscribing) ||
          Stripe_Customer_Detail?.subscription_Status === 'canceled')
          && <PriceList user={user} allPrices={allPrices} annotation={annotation} />}
      </PageShell>)
  }
  return <a href="/api/auth/login">Login</a>;
}

export const getStaticProps: GetStaticProps = async () => {
  // get Subscription Plans from Stripe
  const landingPageText = await fetchContentful(query_archivePricing) // This is for fetching Annotation under the price list
  const allPrices = await fetchAllPrices()

  return {
    props: {
      allPrices: [...allPrices],
      landingPageText: landingPageText.archivePricingCollection.items
    },
    revalidate: 1
  }
}



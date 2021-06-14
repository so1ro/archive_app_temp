import { useState, useEffect } from 'react'
import { GetStaticProps } from "next"

import { useUser } from '@auth0/nextjs-auth0'
import { useUserMetadata } from '@/context/useUserMetadata'
import { fetchAllPrices } from '@/hook/getStaticProps'
import { postData } from '@/utils/helpers'
import PriceList from '@/components/PriceList'
import { fetchContentful } from '@/hook/contentful'
import { query_archivePricing } from '@/hook/contentful-queries'

import { Button, Code, Box, Grid, Center } from '@chakra-ui/react'
import PageShell from '@/components/PageShell'
import LoadingSpinner from '@/components/Spinner'

export default function Account({ allPrices, landingPageText }: { allPrices: AllPrices[], landingPageText: LandingPageText[], }) {

  const { user, error, isLoading } = useUser()
  console.log('user:', user)
  const {
    User_Detail,
    isMetadataLoading,
    subscription_state,
    Stripe_Customer_Detail,
    error_metadata,
    isBeforeCancelDate,
    temporaryCheckIsSubscribing,
    setTemporaryCheckIsSubscribing,
  } = useUserMetadata()

  console.log('allPrices:', allPrices)
  console.log('Stripe_Customer_Detail:', Stripe_Customer_Detail)
  console.log('User_Detail:', User_Detail)

  const { annotation } = landingPageText[0]

  // useEffect
  useEffect(() => {
    if (user && typeof window !== 'undefined' && window.location.search.indexOf('session_id') > 0) {
      const urlParams = new URLSearchParams(window.location.search)
      const session_id = urlParams.get('session_id')
      const checkSession = async () => {
        const customerData: CustomerDataInterface = await postData({
          url: '/api/stripe/check-session',
          data: { session_id }
        }).then(data => data)

        if (customerData.customer_email === user.email) {
          setTemporaryCheckIsSubscribing({ temporaryCheckIsSubscribing: customerData.isSubscribing })
        }
      }
      checkSession()
    }
  }, [user])

  // Function
  const handleCustomerPortal = async (customer_Id: string) => {
    const { url, error } = await postData({
      url: '/api/stripe/create-portal-link',
      data: { customer_Id }
    })
    if (error) return alert(error.message)
    window.location.assign(url)
  }

  const isPermanentView = (Stripe_Customer_Detail) => {
    return (parseFloat(Stripe_Customer_Detail.criteria_OnePay_price) - User_Detail.past_charged_fee) < 0
  }

  // Render
  if (error) return <div>{error.message}</div>

  if ((!isLoading && !isMetadataLoading) && (subscription_state === 'subscribe')) {
    return (
      <PageShell customPT={null} customSpacing={null}>
        <Box w='full' maxW='480px'>
          <Box mb={4}>{user.email} 様</Box>
          <Grid templateColumns={{ base: '1fr', md: '160px auto' }} gap={2} mb={8}>
            <Box>プラン</Box>
            <Box>{Stripe_Customer_Detail.subscription_Price}円／月</Box>
            <Box>特典</Box>
            <Box>{Stripe_Customer_Detail.subscription_Description}</Box>
            <Box>現在のステータス</Box>
            <Box>{Stripe_Customer_Detail.subscription_Status}</Box>
            {Stripe_Customer_Detail.criteria_OnePay_price && !isPermanentView(Stripe_Customer_Detail) && <>
              <Box>永久ご視聴まで残り</Box>
              <Box>{parseFloat(Stripe_Customer_Detail.criteria_OnePay_price) - User_Detail.past_charged_fee}円</Box></>}
            {Stripe_Customer_Detail.criteria_OnePay_price && isPermanentView(Stripe_Customer_Detail) && <>
              <Box>永久ご視聴</Box>
              <Box>○</Box></>}
          </Grid>
          <Center>
            <Button onClick={() => handleCustomerPortal(Stripe_Customer_Detail.customer_Id)}>
              {!Stripe_Customer_Detail.cancel_at_period_end ?
                `プランの変更・キャンセル ／ お支払い履歴` : `サブスクリプションの再開 ／ お支払い履歴`}
            </Button>
          </Center>
        </Box>
        {Stripe_Customer_Detail?.cancel_at_period_end &&
          <Code>
            {`サブスクリプションは、${Stripe_Customer_Detail.cancel_at}` +
              (isBeforeCancelDate ? `までご利用いただけます。` : `にキャンセルされました。`)}
          </Code>}
      </PageShell>)
  }

  if (!isLoading && !isMetadataLoading &&
    (Stripe_Customer_Detail && Stripe_Customer_Detail.subscription_Status === 'canceled')) {
    return (
      <PageShell customPT={null} customSpacing={null}>
        <Box w='full' maxW='480px'>
          <Box mb={4}>{user.email} 様</Box>
          <Box>{Stripe_Customer_Detail.cancel_at}にキャンセルされました。</Box>
          <Grid templateColumns={{ base: '1fr', md: '160px auto' }} gap={2} mb={8}>
            {isPermanentView(Stripe_Customer_Detail) && <>
              <Box>永久ご視聴</Box>
              <Box>○</Box></>}
          </Grid>
          <PriceList user={user} allPrices={allPrices} annotation={annotation} />
        </Box>
      </PageShell>
    )
  }

  if (!isLoading && !isMetadataLoading && !Stripe_Customer_Detail) {
    return (
      <PageShell customPT={null} customSpacing={null}>
        <PriceList user={user} allPrices={allPrices} annotation={annotation} />
      </PageShell>)
  }

  return <LoadingSpinner />
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



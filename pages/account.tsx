import { useState, useEffect } from 'react'
import { GetStaticProps } from "next"

import { useUser } from '@auth0/nextjs-auth0'
import { useUserMetadata } from '@/context/useUserMetadata'
import { fetchAllPrices } from '@/hook/getStaticProps'
import { postData } from '@/utils/helpers'
import PriceList from '@/components/PriceList'
import { fetchContentful } from '@/hook/contentful'
import { query_archivePricing } from '@/hook/contentful-queries'

import { Button, Code, Box, Grid, Center, Text, useToast, HStack, useColorModeValue, Table, Tbody, Tr, Td, TableCaption, useBreakpointValue, } from '@chakra-ui/react'
import PageShell from '@/components/PageShell'
import LoadingSpinner from '@/components/Spinner'
import { CheckCircleIcon } from '@chakra-ui/icons'
import { border_color } from '@/styles/colorModeValue'

export default function Account({ allPrices, landingPageText }: { allPrices: AllPrices[], landingPageText: LandingPageText[], }) {

  const { user, error, isLoading } = useUser()
  const {
    User_Detail,
    isMetadataLoading,
    subscription_state,
    Subscription_Detail,
    One_Pay_Detail,
    error_metadata,
    isBeforeCancelDate,
    temporaryCheckIsSubscribing,
    setTemporaryCheckIsSubscribing,
  } = useUserMetadata()
  const toast = useToast()

  const { annotation } = landingPageText[0]

  const tableSize = useBreakpointValue({ base: 'sm', md: 'md' });


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

  const isPermanentView = (Subscription_Detail) => {
    return (parseFloat(Subscription_Detail.criteria_OnePay_price) - User_Detail.past_charged_fee) <= 0
  }

  const indexBgColor = useColorModeValue(border_color.l, border_color.d)

  // Render
  if (error) return <div>{error.message}</div>

  // サブスクリプション購入後
  if ((!isLoading && !isMetadataLoading) && (subscription_state === 'subscribe')) {

    // Status Table contents
    const status = [
      {
        name: 'プラン',
        value: `${Subscription_Detail.subscription_Price}円／月`,
        display: true
      },
      {
        name: '特典',
        value: Subscription_Detail.subscription_Description,
        display: true
      },
      {
        name: '現在のステータス',
        value: Subscription_Detail.subscription_Status,
        display: true
      },
      {
        name: '永久ご視聴まで残り',
        value: `${parseFloat(Subscription_Detail.criteria_OnePay_price) - User_Detail.past_charged_fee}円`,
        display: !isPermanentView(Subscription_Detail)
      },
      {
        name: '永久ご視聴',
        value: '○',
        display: isPermanentView(Subscription_Detail)
      },
    ]

    return (
      <PageShell customPT={null} customSpacing={null}>
        <Box w='full' maxW='640px'>
          <Box mb={8}>{user.email} 様</Box>
          <Box border='1px' borderColor={indexBgColor} borderRadius={12} mb={16} pt={2} pb={4}>
            <Table variant="striped" colorScheme="gray" size={tableSize}>
              <TableCaption placement='top' mt={0} mb={2}>プラン詳細</TableCaption>
              <Tbody>
                {status.map((s, i) => (s.display && (<Tr key={i}><Td>{s.name}</Td><Td>{s.value}</Td></Tr>)))}
              </Tbody>
            </Table>
          </Box>
          <Center>
            <Button color='#fff' bg='#69b578' fontSize={{ base: 'xs', sm: 'md' }} onClick={() => {
              handleCustomerPortal(Subscription_Detail.customer_Id)
              toast({
                duration: 9000,
                render: () => (
                  <HStack color="white" p={4} bg="#69b578" borderRadius={6} align='flex-start' spacing={4}>
                    <CheckCircleIcon w={6} h={6} color="white" />
                    <Box whiteSpace='pre-wrap'>{"カスタマーポータルに移動中..."}</Box>
                  </HStack>
                )
              })
            }}>
              {!Subscription_Detail.cancel_at_period_end ?
                `プランの変更・キャンセル ／ お支払い履歴` : `サブスクリプションの再開 ／ お支払い履歴`}
            </Button>
          </Center>
        </Box>
        {Subscription_Detail?.cancel_at_period_end &&
          <Code>
            {`サブスクリプションは、${Subscription_Detail.cancel_at}` +
              (isBeforeCancelDate ? `までご利用いただけます。` : `にキャンセルされました。`)}
          </Code>}
      </PageShell>)
  }

  // サブスクリプション未購入、ワンペイ永久ご視聴購入済み
  if (!isLoading && !isMetadataLoading && !Subscription_Detail && One_Pay_Detail) {

    // Status Table contents
    const status = [
      {
        name: 'プラン',
        value: One_Pay_Detail.title,
      },
      {
        name: '特典',
        value: '期限なく、すべてのコンテンツをご視聴をいただけます。',
      },
      {
        name: '永久ご視聴',
        value: '○',
      },
    ]

    return (
      <PageShell customPT={null} customSpacing={null}>
        <Box w='full' maxW='640px'>
          <Box mb={4}>{user.email} 様</Box>
          <Box border='1px' borderColor={indexBgColor} borderRadius={12} mb={16} pt={2} pb={4}>
            <Table variant="striped" colorScheme="gray" size={tableSize}>
              <TableCaption placement='top' mt={0} mb={2}>プラン詳細</TableCaption>
              <Tbody>
                {status.map((s, i) => (<Tr key={i}><Td>{s.name}</Td><Td>{s.value}</Td></Tr>))}
              </Tbody>
            </Table>
          </Box>
          <Text mb={4}>{One_Pay_Detail ? `サブスクリプションを開始することもできます。` : `購入ボタンを押すと、決済に進みます。`}</Text>
          <PriceList user={user} allPrices={allPrices} annotation={annotation} isOnePayPermanent={!!One_Pay_Detail} />
        </Box>
      </PageShell>)
  }

  // サインアップ後、サブスクリプション・ワンペイ永久ご視聴ともに未購入
  if (!isLoading && !isMetadataLoading && !Subscription_Detail && !One_Pay_Detail) {
    return (
      <PageShell customPT={null} customSpacing={null}>
        <Box>
          <Text mb={10}>{`ご購入ボタンからサブスクリプションやワンペイ永久ご視聴プランを開始することができます。`}</Text>
          <PriceList user={user} allPrices={allPrices} annotation={annotation} isOnePayPermanent={false} />
        </Box>
      </PageShell>)
  }

  // サブスクリプションのキャンセル後
  if (!isLoading && !isMetadataLoading &&
    (Subscription_Detail && Subscription_Detail.subscription_Status === 'canceled')) {
    return (
      <PageShell customPT={null} customSpacing={null}>
        <Box w='full' maxW='480px'>
          <Box mb={4}>{user.email} 様</Box>
          <Box>{Subscription_Detail.cancel_at}にキャンセルされました。</Box>
          <Grid templateColumns={{ base: '1fr', md: '160px auto' }} gap={2} mb={8}>
            {isPermanentView(Subscription_Detail) && <>
              <Box>永久ご視聴</Box>
              <Box>○</Box></>}
          </Grid>
          <PriceList user={user} allPrices={allPrices} annotation={annotation} isOnePayPermanent={false} />
        </Box>
      </PageShell>
    )
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
    revalidate: 30
  }
}



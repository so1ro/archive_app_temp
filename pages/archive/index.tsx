import { useState, useEffect } from "react"
import { useRouter } from 'next/router'
import { useUser } from "@auth0/nextjs-auth0"
import { useUserMetadata } from "@/context/useUserMetadata"
import { format, parseISO } from "date-fns"
import { GetStaticProps } from "next"
import { useMediaQuery } from '@/utils/useMediaQuery'

import { fetchContentful } from "@/hook/contentful"
import { query_allArchives, query_archivePricing } from "@/hook/contentful-queries"
// import { postData } from "@/utils/helpers"

import Image from "next/image"
import { Heading, Grid, Box, List, ListItem, Container, VStack, Text, Spinner } from "@chakra-ui/react"
import { css } from "@emotion/react"
import { fetchAllPrices } from '@/hook/getStaticProps';
import PriceList from '@/components/PriceList';
// import { highlight_color } from '@/styles/colorModeValue';
// import { CheckIcon } from '@/styles/icons'
import ArchiveMeritList from "@/components/ArchiveMeritList"
import VideoVimeo from "@/components/VideoVimeo"
import PageShell from '@/components/PageShell'

export default function Archive(
  { allArchives,
    allPrices,
    landingPageText, }:
    {
      allArchives: AllArchivesInterface[],
      allPrices: AllPrices[],
      landingPageText: LandingPageText[],
    }) {

  const { sys: { id }, message, content, functions, merit, vimeoId, explain, annotation } = landingPageText[0]
  const meritListItems = [content, functions, merit]
  const { user, error, isLoading } = useUser()
  const { User_Detail, isMetadataLoading, subscription_state, Stripe_Customer_Detail, error_metadata } = useUserMetadata()
  const isLargerThan768 = useMediaQuery("(min-width: 768px)")
  const messageWithoutNewline = message.replace('\n', '')
  const router = useRouter()

  if (error) return <div>{error.message}</div>
  if (error_metadata) return <div>{error_metadata}</div>

  if (
    (!isLoading && !isMetadataLoading) &&
    (!user || (!!subscription_state && (subscription_state === 'unsubscribe')))) {
    //// Landing Page ////
    return (
      <PageShell customPT={null} customSpacing={null}>
        <Box>
          <Heading
            as='h2'
            size="lg"
            textAlign={{ base: 'left', md: 'center' }}
            whiteSpace='pre-wrap'
            lineHeight={{ base: '32px', md: '42px' }}
            mb={6}>
            {!isLargerThan768 ? messageWithoutNewline : message}
          </Heading>
          <ArchiveMeritList meritListItems={meritListItems} />
        </Box>
        <Box>
          <Text mb={6}>{explain}</Text>
          <VideoVimeo vimeoId={vimeoId} aspect={'52.7%'} autoplay={false} />
        </Box>
        <PriceList user={user} allPrices={allPrices} annotation={annotation} />
      </PageShell>
    )
  }
  if (
    (!isLoading && !isMetadataLoading) &&
    (user && (subscription_state === 'subscribe'))) {
    // Redirect to Archive Page ////
    if (typeof window !== 'undefined') router.push(`/archive/${encodeURI('すべて')}`)
    return (
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="red.500"
        size="xl"
      />
      // アーカイブページへ遷移します
    )
  }
  return <Spinner
    thickness="4px"
    speed="0.65s"
    emptyColor="gray.200"
    color="blue.500"
    size="xl"
  />
}

export const getStaticProps: GetStaticProps = async () => {
  // get Archivce data from Contentful
  const archiveData = await fetchContentful(query_allArchives)
  const allPrices = await fetchAllPrices()
  const landingPageText = await fetchContentful(query_archivePricing)

  return {
    props: {
      allArchives: archiveData.kasumibroVideoCollection.items,
      allPrices: [...allPrices],
      landingPageText: landingPageText.archivePricingCollection.items
    },
    revalidate: 30
  }
}

const imgBox = css`
  img {
    border-radius: 0.4rem;
  }
`
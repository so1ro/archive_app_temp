import { useState, useEffect } from "react"
import { useUser } from "@auth0/nextjs-auth0"
import { useUserMetadata } from "@/context/useUserMetadata"
import { format, parseISO } from "date-fns"
import { GetStaticProps } from "next"

import { fetchContentful } from "@/hook/contentful"
import { query_allArchives, query_archivePricing } from "@/hook/contentful-queries"
import { postData } from "@/utils/helpers"

import Image from "next/image"
import { Heading, Grid, GridItem, Box, List, ListItem, Container, VStack, Text, AspectRatio, useColorMode, useColorModeValue, useMediaQuery } from "@chakra-ui/react"
import { css } from "@emotion/react"
import { fetchAllPrices } from '@/hook/getStaticProps';
import PriceList from '@/components/PriceList';
import styles from "@/styles/Home.module.css"
import { highlight_color } from '@/styles/colorModeValue';
import { CheckIcon } from '@/styles/icons'
import ArchiveMeritList from "@/components/ArchiveMeritList"

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
  const { User_Detail, Stripe_Customer_Detail } = useUserMetadata()
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)")
  const messageWithoutNewline = message.replace('\n', '')

  // const subscription = allPrices.filter(plan => plan.type === 'recurring')
  // const onePay = allPrices.filter(plan => plan.type === 'one_time')

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>
  if (user) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <div>
            Welcome {user.name}! <a href="/api/auth/logout">Logout</a>
          </div>
          <div>Archives</div>
          <Grid templateColumns="1fr" gap={12} px={6}>
            {allArchives.map((archive) => (
              <Grid
                key={archive.sys.id}
                templateColumns="repeat(2, 1fr)"
                gap={12}
              >
                <Box overflow="hidden" css={imgBox}>
                  <Image
                    src={archive.thumbnail.url}
                    alt="Picture of the author"
                    width={640}
                    height={360}
                  />
                </Box>
                <Box>
                  <List m={0} p={0}>
                    <ListItem>{archive.title}</ListItem>
                    <ListItem color="#585858" size="10px">
                      {format(parseISO(archive.publishDate), "yyyy/MM/dd")}
                    </ListItem>
                  </List>
                </Box>
              </Grid>
            ))}
          </Grid>
        </main>
      </div>
    )
  }
  // if (!user) {
  return (
    <Container maxW='1000px'>
      <VStack py={{ base: 12, lg: 24 }} spacing={12}>
        <Heading
          as='h2'
          size="lg"
          textAlign={{ base: 'left', md: 'center' }}
          whiteSpace='pre-wrap'
          lineHeight={{ base: '32px', md: '42px' }}>
          {!isLargerThan768 ? messageWithoutNewline : message}
        </Heading>
        <ArchiveMeritList meritListItems={meritListItems} />
        {/* <div style={{ padding: '52.73% 0 0 0', position: 'relative' }}><iframe src="https://player.vimeo.com/video/551266650?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} title="Talking beside a river"></iframe></div> */}
        {/* <Box><iframe src="https://player.vimeo.com/video/551266650?title=0&amp;byline=0&amp;portrait=0&amp;speed=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" width="4096" height="2160" frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen title="Talking beside a river"></iframe></Box> */}
        {/* <AspectRatio maxW='560px'><iframe src="https://player.vimeo.com/video/551266650?title=0&amp;byline=0&amp;portrait=0&amp;speed=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameBorder="0" allow="fullscreen; picture-in-picture" allowFullScreen title="Talking beside a river"></iframe></AspectRatio> */}

        <Text mb={8}>{explain}</Text>
        <PriceList user={null} allPrices={allPrices} annotation={annotation} />
      </VStack>
    </Container >
  )
  // }
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

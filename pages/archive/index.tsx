import { useState, useEffect } from "react"
import { useUser } from "@auth0/nextjs-auth0"
import { useUserMetadata } from "@/context/useUserMetadata"
import { format, parseISO } from "date-fns"
import { GetStaticProps } from "next"

import { fetchContentful } from "@/hook/contentful"
import { query_allArchives, query_archivePricing } from "@/hook/contentful-queries"
// import { postData } from "@/utils/helpers"

import Image from "next/image"
import { Heading, Grid, Box, List, ListItem, Container, VStack, Text, useMediaQuery } from "@chakra-ui/react"
import { css } from "@emotion/react"
import { fetchAllPrices } from '@/hook/getStaticProps';
import PriceList from '@/components/PriceList';
import styles from "@/styles/Home.module.css"
// import { highlight_color } from '@/styles/colorModeValue';
// import { CheckIcon } from '@/styles/icons'
import ArchiveMeritList from "@/components/ArchiveMeritList"
import VideoVimeo from "@/components/VideoVimeo"
import PageShell from '@/components/PageShell';

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

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>
  // if (user) {
  //   return (
  //     <div className={styles.container}>
  //       <main className={styles.main}>
  //         <div>
  //           Welcome {user.name}! <a href="/api/auth/logout">Logout</a>
  //         </div>
  //         <div>Archives</div>
  //         <Grid templateColumns="1fr" gap={12} px={6}>
  //           {allArchives.map((archive) => (
  //             <Grid
  //               key={archive.sys.id}
  //               templateColumns="repeat(2, 1fr)"
  //               gap={12}
  //             >
  //               <Box overflow="hidden" css={imgBox}>
  //                 <Image
  //                   src={archive.thumbnail.url}
  //                   alt="Picture of the author"
  //                   width={640}
  //                   height={360}
  //                 />
  //               </Box>
  //               <Box>
  //                 <List m={0} p={0}>
  //                   <ListItem>{archive.title}</ListItem>
  //                   <ListItem color="#585858" size="10px">
  //                     {format(parseISO(archive.publishDate), "yyyy/MM/dd")}
  //                   </ListItem>
  //                 </List>
  //               </Box>
  //             </Grid>
  //           ))}
  //         </Grid>
  //       </main>
  //     </div>
  //   )
  // }
  return (
    <PageShell customPY={null}>
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
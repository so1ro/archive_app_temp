import { useState, useEffect } from "react"
import { useUser } from "@auth0/nextjs-auth0"
import { useUserMetadata } from "@/context/useUserMetadata"
import { format, parseISO } from "date-fns"
import { GetStaticProps } from "next"

import { fetchContentful } from "@/hook/contentful"
import { query_allArchives } from "@/hook/contentful-queries"
import { postData } from "@/utils/helpers"

import Image from "next/image"
import { Grid, GridItem, Box, List, ListItem, Container, VStack, Text, useColorModeValue } from "@chakra-ui/react"
import { css } from "@emotion/react"
import { fetchAllPrices } from '@/hook/getStaticProps';
import PriceList from '@/components/PriceList';
import styles from "@/styles/Home.module.css"

export default function Archive(
  { allArchives,
    allPrices }:
    {
      allArchives: AllArchivesInterface[],
      allPrices: AllPrices[]
    }) {

  const { user, error, isLoading } = useUser()
  const { User_Detail, Stripe_Customer_Detail } = useUserMetadata()

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
  return (
    <Container maxW='1000px'>
      <VStack py={{ base: 12, lg: 24 }}>
        <Text mb={8}>
          このアーカイブアプリでは、下記のような4つの「サブスクリプションプラン」と、「ワンペイ永久ご視聴プラン」を用意しました。アーカイブアプリの購入を通して、カスブラをサポートいただけるととてもうれしいです！
        </Text>
        <PriceList user={null} allPrices={allPrices} />
      </VStack>
    </Container>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  // get Archivce data from Contentful
  const data = await fetchContentful(query_allArchives)
  const allPrices = await fetchAllPrices()

  return {
    props: {
      allArchives: data.kasumibroVideoCollection.items,
      allPrices: [...allPrices]
    },
    revalidate: 30
  }
}

const imgBox = css`
  img {
    border-radius: 0.4rem;
  }
`

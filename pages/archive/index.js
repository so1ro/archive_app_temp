import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0'
import { format, parseISO } from 'date-fns'

import { fetchContentful } from '@/hook/contentful'
import { query_allArchives } from '@/hook/contentful-queries'
import { postData } from '@/utils/helpers';

import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import { Grid, GridItem, Box, List, ListItem } from "@chakra-ui/react"
import { css } from '@emotion/react'


export default function Archive({ allArchives }) {

  const { user, error, isLoading } = useUser();
  const [{ subscription }, setSubscription] = useState({ subscription: undefined })


  useEffect(() => {
    if (user) {
      setSubscription({ subscription: user?.metadata?.subscription })
    }

    if (user && typeof window !== 'undefined' && window.location.search.indexOf('session_id') > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      const session_id = urlParams.get('session_id');

      const checkSession = async () => {
        const customerData = await postData({
          url: '/api/stripe/check-session',
          data: { session_id }
        }).then(data => data)
        customerData.customer_email === user.email ? console.log('True') : console.log('false')
      }
      checkSession();
    }
  }, [user])

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (user) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <div>
            Welcome {user.name}! <a href="/api/auth/logout">Logout</a>
          </div>


          <div>
            Archives
            </div>
          <Grid templateColumns="1fr" gap={12} px={6}>
            {allArchives.map((archive) => (
              <Grid key={archive.sys.id} templateColumns="repeat(2, 1fr)" gap={12}>
                <Box overflow="hidden" css={imgBox}>
                  <Image
                    src={archive.thumbnail.url}
                    alt="Picture of the author"
                    width={640}
                    height={360} />
                </Box>
                <Box>
                  <List m={0} p={0}>
                    <ListItem>{archive.title}</ListItem>
                    <ListItem color='#585858' size="10px">{format(parseISO(archive.publishDate), 'yyyy/MM/dd')}</ListItem>
                  </List>
                </Box>
              </Grid>
            ))}
          </Grid>
        </main>
      </div>

    )
  }
  return <a href="/api/auth/login">Login</a>;

}

export async function getStaticProps() {
  // get Archivce data from Contentful
  const data = await fetchContentful(query_allArchives)
  return {
    props: {
      allArchives: data.kasumibroVideoCollection.items,
    },
    revalidate: 1,
  }
}


const imgBox = css`
  img {
    border-radius: 0.4rem;
  }
`

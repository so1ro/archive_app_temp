import { useState } from 'react';
import Image from 'next/image'
import { format, parseISO } from 'date-fns'
import { GetStaticProps } from "next"
import { useRouter } from 'next/router'
import { fetchYouTube } from '@/hook/youtube'

import PageShell from '@/components/PageShell'
import { Grid, GridItem, Box, List, ListItem, useColorModeValue, Flex, Stack, Link } from "@chakra-ui/react"
import { css } from '@emotion/react'
import { YouTubeIcon } from '@/styles/icons';

export default function YouTube({ youTubeData }) {

    const router = useRouter()
    const iconSize = 10

    return (
        <Flex flexGrow={1} direction='row'>
            <PageShell customPT={{ base: 0, lg: 0 }} customSpacing={{ base: 10, lg: 12 }}>
                <Stack
                    direction='column'
                    align='center'
                    pt={{ base: 12, lg: 16 }}
                    pb={{ base: 0, lg: 6 }}
                    spacing={4}>
                    <YouTubeIcon width={iconSize} height={iconSize} color={useColorModeValue('gray.600', '#fff')} />
                </Stack>
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={{ base: 4, md: 6 }} cursor='pointer'>
                    {youTubeData.map((data) => (
                        <Link
                            href={`https://www.youtube.com/watch?v=${data.snippet.resourceId.videoId}`}
                            isExternal
                            key={data.id}>
                            <Grid
                                templateColumns={{ base: "repeat(2, 1fr)", md: "1fr" }}
                                gap={{ base: 4, md: 1 }}
                            // onClick={() => { router.push(`${currentRoot}/?id=${data.sys.id}`, null, { shallow: true }) }}
                            >
                                <Box overflow="hidden">
                                    <Image
                                        src={`${data.snippet.thumbnails.standard.url}`}
                                        alt={data.snippet.title}
                                        width={640}
                                        height={356}
                                        // layout="fill"
                                        objectFit="cover"
                                    />
                                </Box>
                                <Box>
                                    <List m={0} p={0} fontSize={['xs', 'sm', 'md']}>
                                        <ListItem >{data.snippet.title}</ListItem>
                                        {<ListItem color="#585858" size="10px">
                                            {format(parseISO(data.snippet.publishedAt), "yyyy/MM/dd")}
                                        </ListItem>}
                                    </List>
                                </Box>
                            </Grid>
                        </Link>
                    ))}
                </Grid>
            </PageShell>
        </Flex>
    )
}

export const getStaticProps: GetStaticProps = async () => {

    const data = await fetchYouTube()
    return {
        props: {
            youTubeData: data,
        },
        revalidate: 1,
    }
}

const imgBox = css`
  img {
    border-radius: 0.4rem;
  }
`
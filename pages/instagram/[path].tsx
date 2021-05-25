import { GetStaticProps, GetStaticPaths } from "next"
import { getTweets } from '@/lib/twitter'
import {
    query_instagram,
    query_instagram_image_official,
    query_instagram_image_yappi,
    query_instagram_image_chansho,
    query_instagram_image_miyashi,
} from "@/hook/contentful-queries"
import { fetchContentful } from '@/hook/contentful'

import { fetchTweetAst } from 'static-tweets'
import { Tweet } from 'react-static-tweets'
import PageShell from '@/components/PageShell'
import 'react-static-tweets/styles.css'
import { css } from "@emotion/react"
import { VStack, Box } from '@chakra-ui/react'
import { useColorModeValue } from "@chakra-ui/react"
import { card_background_color, bg_color_sns, highlight_color } from '@/styles/colorModeValue'
import NavTwitter from '@/components/NavTwitter'

export default function Twitter({ items }) {
    console.log('items:', items)

    const twitterBlockquoteWrap = css`
    .static-tweet-body {
        background: ${useColorModeValue(card_background_color.l, card_background_color.d)};
        border-color : ${useColorModeValue('', '#263743')};
        color : ${useColorModeValue('', '#fff')};
    }
    
    .static-tweet-body .static-tweet-body {
        border-color : ${useColorModeValue('', '#666')};
        margin-bottom: 8px;
    }
    
    .static-tweet-header-name, .static-tweet-header-username{
        color : ${useColorModeValue('', '#fff')};
    }
    
    .static-tweet-p a {
        color : ${useColorModeValue('', highlight_color.d)};
    }
    
    .image-container {
        border-radius: 0.4rem;
        overflow: hidden;
    }
`

    return (
        <>
            {/* <Box>Instagram</Box>
            <Box bg={useColorModeValue(bg_color_sns.l, bg_color_sns.d)} css={twitterBlockquoteWrap}>
                <NavTwitter items={items} />
                <PageShell customPY={{ base: 0, lg: 0 }} customSpacing={{ base: 10, lg: 12 }}>
                    {twitterAST.map(ast => (<Tweet key={ast.id} id={ast.id} ast={ast.tweetAst} />))}
                </PageShell>
            </Box> */}
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {

    const { instagramCollection } = await fetchContentful(query_instagram)
    console.log('instagramCollection:', instagramCollection)
    const paths = instagramCollection.items.map((col) => ({
        params: { path: col.path }
    }))

    return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {

    const { instagramOfficialCollection } = await fetchContentful(query_instagram_image_official)
    const { instagramUser1Collection } = await fetchContentful(query_instagram_image_yappi)
    const { instagramUser2Collection } = await fetchContentful(query_instagram_image_chansho)
    const { instagramUser3Collection } = await fetchContentful(query_instagram_image_miyashi)

    let allInstagramCollection = [
        ...instagramOfficialCollection.items,
        ...instagramUser1Collection.items,
        ...instagramUser2Collection.items,
        ...instagramUser3Collection.items
    ]

    const instagraItems = await allInstagramCollection.filter(col => col.id === params.path)

    return {
        props: { items: instagraItems },
        revalidate: 1,
    }
}
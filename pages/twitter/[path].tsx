import { GetStaticProps, GetStaticPaths } from "next"
import { getTweets } from '@/lib/twitter'
import { query_twitter } from "@/hook/contentful-queries"
import { fetchContentful } from '@/hook/contentful'
import useSWR, { SWRConfig } from "swr"

import { fetchTweetAst } from 'static-tweets'
import { Tweet } from 'react-static-tweets'
import PageShell from '@/components/PageShell'
import 'react-static-tweets/styles.css'
import { css } from "@emotion/react"
import { VStack, Box } from '@chakra-ui/react'
import { useColorModeValue } from "@chakra-ui/react"
import { card_background_color, highlight_color } from '@/styles/colorModeValue'
import NavSNS from '@/components/NavSNS'


export default function Twitter({ fallback, items, twitterId }) {

    const navItems = items.map(item => ({ id: item.sys.id, name: item.name, path: item.path }))
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
    // SWR
    async function fetcher(url) {
        const res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({ twitterId }),
            headers: { 'Content-Type': 'application/json' },
        })
        return res.json()
    }
    const url = '/api/twitter'
    const { data, error } = useSWR(url, fetcher)

    // Component
    const TwitterDom = () => {
        const { data: { twitterAST } } = useSWR('/api/twitter', fetcher)
        return twitterAST.map(ast => (<Tweet key={ast.id} id={ast.id} ast={ast.tweetAst} />))
    }

    if (error) return <Box>failed to load...</Box>
    if (!data) return <div>loading...</div>

    return (
        <Box css={twitterBlockquoteWrap}>
            <PageShell customPT={{ base: 0, lg: 0 }} customSpacing={{ base: 10, lg: 12 }}>
                <NavSNS items={navItems} />
                <SWRConfig value={{ fallback }}>
                    <TwitterDom />
                </SWRConfig>
                {/* {twitterAST.map(ast => (<Tweet key={ast.id} id={ast.id} ast={ast.tweetAst} />))} */}
            </PageShell>
        </Box>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {

    const { twitterCollection } = await fetchContentful(query_twitter)
    const paths = twitterCollection.items.map((col) => ({
        params: { path: col.path }
    }))

    return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {

    const { twitterCollection } = await fetchContentful(query_twitter)
    const twitterItem = await twitterCollection.items.find(col => col.path === params.path)
    const { data } = await getTweets(twitterItem.twitterId)
    const allTweetId = data.map(t => t.id)

    let twitterAST = []
    for (const id of allTweetId) {
        const tweetAst = await fetchTweetAst(id)
        twitterAST.push({ id, tweetAst })
    }

    return {
        props: {
            fallback: {
                '/api/twitter': twitterAST
            },
            items: twitterCollection.items,
            twitterId: twitterItem.twitterId
        },
        revalidate: 1,
    }
}
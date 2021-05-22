import { GetStaticProps, GetStaticPaths } from "next"
import { getTweets } from '@/lib/twitter'
import { query_twitter } from "@/hook/contentful-queries"
import { fetchContentful } from '@/hook/contentful';

import { fetchTweetAst } from 'static-tweets'
import { Tweet } from 'react-static-tweets'
import PageShell from '@/components/PageShell'
import 'react-static-tweets/styles.css'
import { css } from "@emotion/react"
import { VStack } from '@chakra-ui/react';
import { useColorModeValue } from "@chakra-ui/react"
import { background_color } from '@/styles/colorModeValue';

export default function Twitter({ twitterAST }) {

    const twitterBlockquoteWrap = css`
    .static-tweet-body{
        background: ${useColorModeValue(background_color.l, background_color.d)};
        border-color : ${useColorModeValue('', '#666')};
        color : ${useColorModeValue('', '#fff')};
    }
    
    .static-tweet-header-name, .static-tweet-header-username{
        color : ${useColorModeValue('', '#fff')};
    }
    
    // .static-tweet-like, .static-tweet-time{
    //     color : ${useColorModeValue('', '#fff')};
    // }
    
    .image-container {
        border-radius: 0.4rem;
        overflow: hidden;
    }
`

    return (
        <PageShell customPY={null}>
            <VStack spacing={10} css={twitterBlockquoteWrap}>
                {twitterAST.map(ast => (<Tweet key={ast.id} id={ast.id} ast={ast.tweetAst} />))}
            </VStack>
        </PageShell>
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
        props: { twitterAST },
        revalidate: 1,
    }
}
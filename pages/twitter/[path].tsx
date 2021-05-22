import { GetStaticProps, GetStaticPaths } from "next"
import { getTweets } from '@/lib/twitter'
import { query_twitter } from "@/hook/contentful-queries"
import { fetchContentful } from '@/hook/contentful';

import { fetchTweetAst } from 'static-tweets'
import { Tweet } from 'react-static-tweets'
import PageShell from '@/components/PageShell'
import 'react-static-tweets/styles.css'

export default function Twitter({ twitterAST }) {
    return <PageShell customPY={null}> {twitterAST.map(ast => (<Tweet key={ast.id} id={ast.id} ast={ast.tweetAst} />))} </PageShell>
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
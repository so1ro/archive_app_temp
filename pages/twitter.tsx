import { getTweets } from '@/lib/twitter'
import { GetStaticProps } from "next"

import { fetchTweetAst } from 'static-tweets'
import { Tweet } from 'react-static-tweets'
import 'react-static-tweets/styles.css'
import PageShell from '@/components/PageShell'

export default function Twitter({ twitterAST }) {
    return (
        <PageShell customPY={null}>
            {twitterAST.map(ast => (<Tweet key={ast.id} id={ast.id} ast={ast.tweetAst} />))}
        </PageShell>
    )
}

export const getStaticProps: GetStaticProps = async () => {

    const { data } = await getTweets()
    const tweetId = data.map(t => t.id)

    let twitterAST = []
    for (const id of tweetId) {
        const tweetAst = await fetchTweetAst(id)
        twitterAST.push({ id, tweetAst })
    }

    return {
        props: { twitterAST },
        revalidate: 1,
    }
}
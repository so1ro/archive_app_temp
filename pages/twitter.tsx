import React from 'react';
import { getTweets } from '@/lib/twitter'
import { GetStaticProps } from "next"

export default function Twitter({
    tweets
}
    // Add types later...
    // : {
    //     tweets: {
    //         id: string
    //     }
    // }
) {
    return (
        <ul>
            {tweets.data.map(tweet => (
                <li key={tweet.id} > { tweet.text} </li>
            ))}
        </ul>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    const tweets = await getTweets()
    return {
        props: { tweets },
        revalidate: 1,
    }
}
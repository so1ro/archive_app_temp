import React from 'react';
import { getTweets } from '@/lib/twitter'
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

export default withPageAuthRequired(function Twitter({ tweets }) {
    console.log('tweets:', tweets)
    return (
        <ul>
            {tweets.data.map(tweet => (
                <li key={tweet.id}>{tweet.text}</li>
            ))}
        </ul>
    );
});

export async function getStaticProps() {
    const tweets = await getTweets()
    return {
        props: { tweets },
        revalidate: 1,
    }
}
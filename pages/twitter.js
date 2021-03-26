import React from 'react';
import { getTweets } from '@/lib/twitter';

const Twitter = ({ tweets }) => {
    console.log('tweets:', tweets)
    return (
        <ul>
            {tweets.data.map(tweet => (
                <li key={tweet.id}>{tweet.text}</li>
            ))}
        </ul>
    );
};

export async function getStaticProps() {
    const tweets = await getTweets()
    return {
        props: { tweets },
        revalidate: 1,
    }
}


export default Twitter;
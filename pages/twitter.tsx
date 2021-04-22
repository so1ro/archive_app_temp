import React from 'react';
import { getData } from '@/utils/helpers';

export default function twitter({ tweets }: { tweets: object[] }) {
    return (
        <ul>
            {tweets.data.map(tweet => (
                <li key={tweet.id}>{tweet.text}</li>
            ))}
        </ul>
    );
};

export async function getStaticProps() {
    const tweets = await getData({ url: `${process.env.NEXT_PUBLIC_DOMAIN}/api/twitter` })

    return {
        props: { tweets },
        revalidate: 1,
    }
}
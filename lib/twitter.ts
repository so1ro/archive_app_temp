export const getTweets = async (id) => {
    const res = await fetch(
        `https://api.twitter.com/2/users/${id}/tweets?max_results=16&exclude=replies,retweets`,
        { headers: { Authorization: `Bearer ${process.env.TWITTER_API_KEY}` } }
    )

    const tweets = await res.json()
    return tweets
}
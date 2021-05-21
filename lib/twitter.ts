export const getTweets = async () => {
    const res = await fetch(
        `https://api.twitter.com/2/users/4554809112/tweets?max_results=16&exclude=replies`,
        { headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TWITTER_API_KEY}` } }
    )
    // カスブラさん：955353449939398657
    // ヤッピーさん：898914504959967233
    // ちゃんしょさん：1389126655
    // みやしさん：4554809112

    const tweets = await res.json()
    return tweets
}
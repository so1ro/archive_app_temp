import { NextApiRequest, NextApiResponse } from 'next'

export default async function twitterApit(_: NextApiRequest, res: NextApiResponse) {
  // const tweets = await getTweets()
  const data = await fetch(
    `https://api.twitter.com/2/users/1252499157559832576/tweets?max_results=16&expansions=author_id,attachments.media_keys&tweet.fields=created_at,public_metrics&user.fields=profile_image_url&media.fields=height,media_key,type,url,width`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TWITTER_API_KEY}`
      }
    }
  )

  const tweets = await data.json()

  return res.status(200).json(tweets)
}

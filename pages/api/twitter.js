import { getTweets } from '@/lib/twitter';

export default async (_, res) => {
  const tweets = await getTweets()

  return res.status(200).json(tweets)
}

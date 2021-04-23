import { getTweets } from '@/lib/twitter';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function twitterApit(_, res) {
  const tweets = await getTweets()

  return res.status(200).json(tweets)
})

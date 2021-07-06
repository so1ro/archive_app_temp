import { upsertFavoriteVideo } from '@/utils/useAuth0'
import { NextApiRequest, NextApiResponse } from 'next'

const upsertFavoriteVideoToAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  const { auth0_UUID, favoriteVideo }: { auth0_UUID: string, favoriteVideo: [] } = JSON.parse(req.body)

  if (req.method === 'POST') {
    try {
      const data = await upsertFavoriteVideo(auth0_UUID, favoriteVideo)
      return res.status(200).json({ data })

    } catch (e) {
      res.status(400)
      return res.send({
        error: {
          message: e.message,
        }
      })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}

export default upsertFavoriteVideoToAuth

import { upsertFavoriteVideo } from '@/utils/useAuth0'
import { NextApiRequest, NextApiResponse } from 'next'

const upsertFavoriteVideoToAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  const { auth0_UUID, vimeoId }: { auth0_UUID: string, vimeoId: string } = JSON.parse(req.body)

  if (req.method === 'POST') {
    try {
      // const { user_metadata }: { user_metadata: object } = await upsertFavoriteVideo(vimeoId)
      const data = await upsertFavoriteVideo(auth0_UUID, vimeoId)
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

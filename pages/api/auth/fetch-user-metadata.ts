import { getUserMetadata } from '@/utils/useAuth0';
import { NextApiRequest, NextApiResponse } from 'next'

const retrieveUserMetadata = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user_id }: { user_id: string } = JSON.parse(req.body);

  if (req.method === 'POST') {
    try {
      const { user_metadata }: { user_metadata: object } = await getUserMetadata(user_id)
      return res.status(200).json({ user_metadata });

    } catch (e) {
      res.status(400);
      return res.send({
        error: {
          message: e.message,
        }
      });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default retrieveUserMetadata;

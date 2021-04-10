import { getUserMetadata } from '@/utils/useAuth0';

const retrieveUserMetadata = async (req, res) => {
  const { user_id } = JSON.parse(req.body);

  if (req.method === 'POST') {
    try {
      const { user_metadata } = await getUserMetadata(user_id)
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

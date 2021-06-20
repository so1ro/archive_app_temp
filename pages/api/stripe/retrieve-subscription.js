import { stripe } from '@/utils/stripe'

const retrieveSubscription = async (req, res) => {
  const { subscription_Id } = JSON.parse(req.body)

  if (req.method === 'POST') {
    try {
      const subscriptionsObj = await stripe.subscriptions.retrieve(subscription_Id)
      return res.status(200).json({ subscriptionsObj })

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

export default retrieveSubscription

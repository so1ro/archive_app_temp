import { NextApiRequest, NextApiResponse } from 'next'

const contactApi = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'POST') {

		const contact = req.body
		const finalContactData = {
			...contact,
			replyTo: process.env.CONTACT_EMAIL,
			accessKey: process.env.STATIC_FORMS_ACCESS_KEY,
		}

		try {
			const result = await fetch('https://api.staticforms.xyz/submit', {
				method: 'POST',
				body: JSON.stringify(finalContactData),
				headers: { 'Content-Type': 'application/json' },
			})
			const json = await result.json()

			if (json.success) {
				//成功したら json を return
				return res.status(200).json(json)

			} else {
				res.status(400)
				return res.send({
					error: {
						message: json.message,
					}
				})
			}
		} catch (e) {
			console.log('An error occurred', e)
		}
	} else {
		res.setHeader('Allow', 'POST')
		res.status(405).end('Method Not Allowed')
	}
}

export default contactApi
const updateUserPlan = async (req, res) => {
    const { checkoutSession } = JSON.parse(req.body);

    if (req.method === 'POST') {
        try {
            console.log('checkoutSession:', checkoutSession)

            return res.status(200).json({});

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

export default updateUserPlan;

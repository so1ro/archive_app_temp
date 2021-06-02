import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next'

export default handleAuth({
    async login(req: NextApiRequest, res: NextApiResponse) {
        try {
            await handleLogin(req, res, {
                returnTo: `/archive`,// `/archive/${encodeURI('すべて')}` 
                authorizationParams: { screen_hint: (req.query.param || null) }
            });
        } catch (error) {
            res.status(error.status || 500).end(error.message);
        }
    }
});
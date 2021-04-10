import { stripe } from '@/utils/stripe';
import axios from 'axios';

const { AUTH0_DOMAIN, AUTH0_MTOM_CLIENTID, AUTH0_MTOM_CLIENT_SECRET } = process.env

////////////////////////////////////////////////
// Get Auth0 Access Token
const auth0AccessToken = async () => {
    // Options of Fetch Access_token
    const options = {
        method: 'post',
        url: `https://${AUTH0_DOMAIN}/oauth/token`,
        headers: { 'Content-Type': 'application/json' },
        data: {
            audience: `https://${AUTH0_DOMAIN}/api/v2/`,
            grant_type: "client_credentials",
            client_id: `${AUTH0_MTOM_CLIENTID}`,
            client_secret: `${AUTH0_MTOM_CLIENT_SECRET}`
        }
    };
    try {
        const { access_token } = await axios(options).then(res => res.data)
        return access_token

    } catch (error) {
        console.log('error:', error)
        throw new Error(error)
    }
}

////////////////////////////////////////////////
// Patch user's App_metadata to Auth0
const patchUserMetadataToAuth0 = async (user_id, token, planName, priceId) => {
    const URL = `https://${AUTH0_DOMAIN}/api/v2/users/${user_id}`
    const option = {
        url: URL,
        method: 'PATCH',
        headers: {
            authorization: `Bearer ${token}`
        },
        data: {
            user_metadata: { planName, priceId }
        }
    }

    const data = await axios(option)
        .then(res => res.data)
        .catch(err => console.log(err))
    console.log('data:', data)
}

////////////////////////////////////////////////
// Exported Function
const upsertPurchaseRecord = async (event) => {
    const customerId = event.customer
    const planName = event.plan.nickname

    const { metadata: { priceId, auth0UUID } } = await stripe.customers.retrieve(customerId);

    const auth0Token = await auth0AccessToken()
    patchUserMetadataToAuth0(auth0UUID, auth0Token, planName, priceId)
};

////////////////////////////////////////////////


export {
    upsertPurchaseRecord
};
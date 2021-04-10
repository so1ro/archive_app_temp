import { stripe } from '@/utils/stripe';
import axios from 'axios';

const { AUTH0_DOMAIN, AUTH0_MTOM_CLIENTID, AUTH0_MTOM_CLIENT_SECRET } = process.env
const getAuth0URL = (id) => {
    return `https://${AUTH0_DOMAIN}/api/v2/users/${id}`
}

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
const patchUserMetadataToAuth0 = async (user_id, token, stripeCustomerDetail) => {
    const URL = `https://${AUTH0_DOMAIN}/api/v2/users/${user_id}`
    const option = {
        url: URL,
        method: 'PATCH',
        headers: {
            authorization: `Bearer ${token}`
        },
        data: {
            user_metadata: { Stripe_Customer_Detail: stripeCustomerDetail }
        }
    }

    const data = await axios(option)
        .then(res => res.data)
        .catch(err => console.log(err))
    console.log('data:', data)
}

////////////////////////////////////////////////
// Exported Function
////////////////////////////////////////////////

//// Get User metadata from Auth0
const getUserMetadata = async (user_id) => {
    const URL = getAuth0URL(user_id)
    const auth0Token = await auth0AccessToken()

    const option = { headers: { authorization: `Bearer ${auth0Token}` } }

    const data = axios(URL, option)
        .then(res => res.data)
        .catch(err => { throw new Error(err) })

    return data
}


//// Send purchase record to Auth0
const upsertPurchaseRecord = async (event) => {
    const customerId = event.customer
    const planName = event.plan.nickname

    const { metadata: { priceId, auth0UUID } } = await stripe.customers.retrieve(customerId);
    const stripeCustomerDetail = {
        customerId,
        priceId,
        planName,
    }

    const auth0Token = await auth0AccessToken()
    patchUserMetadataToAuth0(auth0UUID, auth0Token, stripeCustomerDetail)
};

////////////////////////////////////////////////


export {
    upsertPurchaseRecord,
    getUserMetadata,
};
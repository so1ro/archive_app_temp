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
const patchUserMetadataToAuth0 = async (user_id, token, metadata) => {
    console.log('metadata:', metadata)
    const URL = `https://${AUTH0_DOMAIN}/api/v2/users/${user_id}`
    const option = {
        url: URL,
        method: 'PATCH',
        headers: {
            authorization: `Bearer ${token}`
        },
        data: {
            user_metadata: { ...metadata }
        }
    }

    const data = await axios(option)
        .then(res => res.data)
        .catch(err => console.log(err))
    // console.log('data:', data)
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


//// Send Subscription record to Auth0
const upsertSubscriptionRecord = async (event) => {

    const { id: subscription_Id,
        customer: customer_Id,
        plan: { nickname: subscription_Name },
        status: subscription_Status,
        cancel_at_period_end,
        cancel_at,
        canceled_at, } = event
    try {
        const { metadata: { price_Id, auth0_UUID } } = await stripe.customers.retrieve(customer_Id);
        const metadata = {
            Stripe_Customer_Detail: {
                customer_Id,
                price_Id,
                subscription_Name,
                subscription_Id,
                subscription_Status,
                cancel_at_period_end,
                cancel_at,
                canceled_at,
            }
        }
        // canceled_at : If the subscription has been canceled, the date of that cancellation. If the subscription was canceled with cancel_at_period_end, canceled_at will reflect the time of the most recent update request, not the end of the subscription period when the subscription is automatically moved to a canceled state.

        const auth0Token = await auth0AccessToken()
        patchUserMetadataToAuth0(auth0_UUID, auth0Token, metadata)

    } catch (err) {
        console.log(`❌ Error message: ${err.message}`);
        throw new Error(err)
    }
};

//// Send Charge (Payment Amount) record to Auth0
const upsertChargeRecord = async (obj) => {

    const status = obj.object // 'invoice' or 'refund'
    const customer_Id = obj.customer
    let amount
    if (status === 'invoice') amount = obj.amount_paid
    if (status === 'refund') amount = obj.amount_refunded * -1

    try {
        const { metadata: { auth0_UUID } } = await stripe.customers.retrieve(customer_Id);
        const { user_metadata: { past_charged_fee } } = await getUserMetadata(auth0_UUID)
        const auth0Token = await auth0AccessToken()
        patchUserMetadataToAuth0(auth0_UUID, auth0Token, { past_charged_fee: ((past_charged_fee + amount) || 0) })

    } catch (err) {
        console.log(`❌ Error message: ${err.message}`);
        throw new Error(err)
    }
};

////////////////////////////////////////////////


export {
    getUserMetadata,
    upsertSubscriptionRecord,
    upsertChargeRecord,
};
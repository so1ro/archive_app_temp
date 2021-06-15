import { stripe } from '@/utils/stripe';
import axios from 'axios';

const getAuth0URL = (id) => {
    return `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${id}`
}

////////////////////////////////////////////////
// Get Auth0 Access Token
const auth0AccessToken = async () => {
    // Options of Fetch Access_token
    const options = {
        method: 'post',
        url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
        headers: { 'Content-Type': 'application/json' },
        data: {
            audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
            grant_type: "client_credentials",
            client_id: `${process.env.AUTH0_MTOM_CLIENTID}`,
            client_secret: `${process.env.AUTH0_MTOM_CLIENT_SECRET}`
        }
    };
    const { access_token } = await axios(options)
        .then(res => res.data)
        .catch(err => { throw new Error(err) })
    return access_token

}

////////////////////////////////////////////////
// Patch user's App_metadata to Auth0
const patchUserMetadataToAuth0 = async (user_id, token, metadata) => {
    const URL = `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${user_id}`
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
        .catch(err => { throw new Error(err) })
}

////////////////////////////////////////////////
// Exported Function
////////////////////////////////////////////////

//// Get User metadata from Auth0
const getUserMetadata = async (user_id, token) => {
    const URL = getAuth0URL(user_id)
    const auth0Token = !!token ? token : await auth0AccessToken()

    const option = { headers: { authorization: `Bearer ${auth0Token}` } }
    const data = await axios(URL, option)
        .then(res => res.data)
        .catch(err => { throw new Error(err) })

    return data
}


//// Send Subscription record to Auth0
const upsertSubscriptionRecord = async (event) => {

    const { id: subscription_Id,
        customer: customer_Id,
        plan: { amount: subscription_Price, nickname: subscription_Description },
        status: subscription_Status,
        cancel_at_period_end,
        cancel_at,
        canceled_at, } = event

    try {
        // const customerData = await stripe.customers.retrieve(customer_Id);
        // console.log('customerData:', customerData)
        const { metadata: { price_Id, auth0_UUID, criteria_OnePay_price } } = await stripe.customers.retrieve(customer_Id);
        const auth0Token = await auth0AccessToken()
        const metadata = {
            Stripe_Customer_Detail: {
                title: 'サブスクリプション',
                customer_Id,
                price_Id,
                subscription_Price,
                subscription_Description,
                subscription_Id,
                subscription_Status,
                cancel_at_period_end,
                cancel_at,
                canceled_at,
                criteria_OnePay_price,
            }
        }
        // canceled_at : If the subscription has been canceled, the date of that cancellation. If the subscription was canceled with cancel_at_period_end, canceled_at will reflect the time of the most recent update request, not the end of the subscription period when the subscription is automatically moved to a canceled state.
        await patchUserMetadataToAuth0(auth0_UUID, auth0Token, metadata)

    } catch (error) {
        console.log('Error in upsertSubscriptionRecord:', error)
        throw new Error(err)
    }
};

//// Send Charge (Payment Amount) record to Auth0
const upsertChargeRecord = async (event) => {

    const status = event.object // 'invoice' or 'refund'
    const customer_Id = event.customer

    let amount
    if (status === 'invoice') amount = event.amount_paid
    if (status === 'charge') amount = event.amount_refunded * -1

    try {
        const { metadata: { auth0_UUID } } = await stripe.customers.retrieve(customer_Id);
        const auth0Token = await auth0AccessToken()
        const { user_metadata: { past_charged_fee } } = await getUserMetadata(auth0_UUID, auth0Token)
        const currentChargedFee = (past_charged_fee + amount) || 0
        await patchUserMetadataToAuth0(auth0_UUID, auth0Token, { past_charged_fee: currentChargedFee })

    } catch (error) {
        console.log('Error in upsertChargeRecord:', error)
        throw new Error(err)
    }
};

//// Send One-pay record to Auth0
const upsertOnePayRecord = async (event) => {

    const { amount, customer: customer_Id, created, } = event

    try {
        const { metadata: { price_Id, auth0_UUID, criteria_OnePay_price } } = await stripe.customers.retrieve(customer_Id);
        const auth0Token = await auth0AccessToken()
        const metadata = {
            One_Pay_Permanent_Detail: {
                title: 'ワンペイ永久ご視聴',
                price_Id,
                created,
                criteria_OnePay_price,
            }
        }

        const { user_metadata: { past_charged_fee } } = await getUserMetadata(auth0_UUID, auth0Token)
        const currentChargedFee = (past_charged_fee + amount) || 0

        await patchUserMetadataToAuth0(auth0_UUID, auth0Token, metadata)
        await patchUserMetadataToAuth0(auth0_UUID, auth0Token, { past_charged_fee: currentChargedFee })

    } catch (error) {
        console.log('Error in upsertOnePayRecord:', error)
        throw new Error(err)
    }
};
////////////////////////////////////////////////


export {
    getUserMetadata,
    upsertSubscriptionRecord,
    upsertChargeRecord,
    upsertOnePayRecord,
};
// import { stripe } from './stripe';

// ///////
// import axios from 'axios'
// import request from "request"

// exports.handler = function (event, context, callback) {

//     // Parameters
//     const { GATSBY_AUTH0_DOMAIN, AUTH0_MTOM_CLIENTID, AUTH0_MTOM_CLIENT_SECRET } = process.env
//     const user_id = event.queryStringParameters.user_id
//     const savedBookPage = JSON.parse(event.queryStringParameters.savedBookPage)
//     const URL = `https://${GATSBY_AUTH0_DOMAIN}/api/v2/users/${user_id}`

//     // Params of GET access_token options
//     const options = {
//         method: 'POST',
//         url: `https://${GATSBY_AUTH0_DOMAIN}/oauth/token`,
//         headers: { 'content-type': 'application/json' },
//         body: `{
//             "client_id":"${AUTH0_MTOM_CLIENTID}",
//             "client_secret":"${AUTH0_MTOM_CLIENT_SECRET}",
//             "audience":"https://${GATSBY_AUTH0_DOMAIN}/api/v2/",
//             "grant_type":"client_credentials"
//         }`
//     };

//     // Response to client
//     const send = (body) => {
//         callback(null, {
//             statusCode: 200,
//             headers: {
//                 'Access-Control-Allow-Origin': '*',
//                 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
//             },
//             body: JSON.stringify(body)
//         })
//     }

//     let access_token = {}
//     let user_metadata = { savedBookPage: savedBookPage }

//     // GET access_token
//     request(options, (err, res, body) => {
//         if (!err && res.statusCode == 200) {
//             access_token = JSON.parse(body).access_token
//             const option = {
//                 url: URL,
//                 method: 'PATCH',
//                 headers: {
//                     authorization: `Bearer ${access_token}`
//                 },
//                 data: {
//                     user_metadata
//                 }
//             }

//             // Patch user's App_metadata
//             const patchUserSaveArchives = () => {
//                 axios(option)
//                     .then(res => send(res.data))
//                     .catch(err => send(err))
//             }

//             if (event.httpMethod == "GET") {
//                 patchUserSaveArchives()
//             }
//         } else throw new Error(err)
//     }
//     )
// }
// ///////
import { stripe } from '@/utils/stripe';
import axios from 'axios';

const upsertProductRecord = async (product) => {
    const productData = {
        id: product.id,
        active: product.active,
        name: product.name,
        description: product.description,
        image: product.images?.[0] ?? null,
        metadata: product.metadata
    };

    const { error } = await supabaseAdmin
        .from('products')
        .insert([productData], { upsert: true });
    if (error) throw error;
    console.log(`Product inserted/updated: ${product.id}`);
}



////////////////////////////////////////////////
const { AUTH0_DOMAIN, AUTH0_MTOM_CLIENTID, AUTH0_MTOM_CLIENT_SECRET } = process.env

////////////////////////////////////////////////
// Get Auth0 Access Token
const auth0AccessToken = async () => {

    // Params of GET access_token options
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
    // console.log(`Product inserted/updated: ${planName}/${priceId}`);
}

////////////////////////////////////////////////
// Export Function
const upsertPurchaseRecord = async (event) => {
    const customerId = event.customer
    const planName = event.plan.nickname
    console.log('planName:', planName)
    // const subscriptionId = event.id

    const { metadata: { priceId, auth0UUID } } = await stripe.customers.retrieve(customerId);
    console.log('auth0UUID:', auth0UUID)
    console.log('priceId:', priceId)

    const auth0Token = await auth0AccessToken()
    console.log('auth0Token:', auth0Token)
    patchUserMetadataToAuth0(auth0UUID, auth0Token, planName, priceId)
};

////////////////////////////////////////////////


export {
    upsertProductRecord,
    upsertPurchaseRecord
};
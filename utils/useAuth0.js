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


const upsertPurchaseRecord = async (event) => {
    console.log('event:', event)
};


export {
    upsertProductRecord,
    upsertPurchaseRecord
};

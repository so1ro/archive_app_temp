const accessToken = process.env.NEXT_PUBLIC_FACEBOOK_ACCESS_TOKEN
const limit = 16
const fields = 'message,created_time,permalink_url,full_picture,id'

export async function fetchFacebook() {
    // add a try / catch loop for nicer error handling
    try {
        const res = await fetch(
            `https://graph.facebook.com/me/feed?fields=${fields}&limit=${limit}`,
            {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${accessToken}`,
                }
            },
        )
        const { data } = await res.json();
        return data;
    } catch (error) {
        // add a descriptive error message first,
        // so we know which GraphQL query caused the issue
        console.error(`There was a problem retrieving entries from Facebook`);
        console.error(error);
    }
}

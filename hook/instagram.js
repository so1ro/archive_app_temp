const id = process.env.NEXT_PUBLIC_INSTAGRAM_ID
const accessToken = process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN
const fields = 'id,media_type,media_url,owner,timestamp,permalink,like_count,comments_count'
const limit = 16

export async function fetchInstagram(query) {
    // add a try / catch loop for nicer error handling
    try {
        const res = await fetch(
            `https://graph.facebook.com/v10.0/${id}/media?fields=${fields}&access_token=${accessToken}&limit=${limit}`
        )
        const { data } = await res.json();
        return data;
    } catch (error) {
        // add a descriptive error message first,
        // so we know which GraphQL query caused the issue
        console.error(`There was a problem retrieving entries from Instagram`);
        console.error(error);
    }
}

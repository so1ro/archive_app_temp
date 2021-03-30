const playList = process.env.NEXT_PUBLIC_YOUTUBE_PLAYLISTID
const accessToken = process.env.NEXT_PUBLIC_YOUTUBE_ACCESS_TOKEN
const fields = 'id,media_type,media_url,owner,timestamp,permalink,like_count,comments_count,caption'
const limit = 56

export async function fetchYouTube() {
    // add a try / catch loop for nicer error handling
    try {
        const res = await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playList}&maxResults=${limit}&key=${accessToken}`
        )
        const { items } = await res.json();
        return items;
    } catch (error) {
        // add a descriptive error message first,
        // so we know which GraphQL query caused the issue
        console.error(`There was a problem retrieving entries from YouTube`);
        console.error(error);
    }
}

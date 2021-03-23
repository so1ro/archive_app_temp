export const query_allArchives =
    ` {
        kasumibroVideoCollection ( order : publishDate_DESC ) {
            items {
                sys {
                    id
                }
                thumbnail {
                    url
                }
                title
                publishDate
                vimeoUrl
                category
                keyword
                releasedYear
                casts
                place
                season
                expert
                }
        }
    }
    `
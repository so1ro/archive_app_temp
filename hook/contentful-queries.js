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
// Top / Hero
export const query_allHeroImg =
  ` {
  topHeroImgsCollection(order : sys_publishedAt_DESC){
    items{
      imageCollection{
        items{
          sys{
            id
                  }
                  title
                  fileName
                  url
                  width
                }
              }
            }
          }
        }
    `

// Top / Introduction
export const query_topIntro = `{
  topIntroCollection{
    items{
      sys{
        id
      }
      	text
        avatar{
          url
        }
    }
  }
}`
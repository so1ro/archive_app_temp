////// Graphql Chrome Extension //////
// URL: https://graphql.contentful.com/content/v1/spaces/ughdotpe40cx
// 下部の HTTP HEADERS に下記追加する。SecretはContentfulのwebhooせ設定から利用。
// {"Authorization": "Bearer ~~~~~"}

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

// Top / Shop
export const query_topShop = `{
  topShopCollection{
    items{
      sys{
        id
      }
      productName
      productImage{
        url
      }
      url      
    }
  }
}`

// Archive / Pricing
export const query_archivePricing = `{
  archivePricingCollection {
    items {
      sys {
        id
      }
      message
      content
      functions
      merit
      vimeoId
      explain
      annotation
    }
  }
}`

// Twitter
export const query_twitter = `{
  twitterCollection{
    items{
      sys{
        id
      }
      name
      twitterId
      path
    }
  }
}`
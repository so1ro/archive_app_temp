////// Graphql Chrome Extension //////
// URL: https://graphql.contentful.com/content/v1/spaces/ughdotpe40cx
// 下部の HTTP HEADERS に下記追加する。SecretはContentfulのwebhooせ設定から利用。
// {"Authorization": "Bearer ~~~~~"}

// All Archive
export const query_allArchives =
  `{
    kasumibroVideoCollection ( order : publishDate_DESC ) {
      items {
        sys {
          id
        }
        thumbnail {
          url(transform: { resizeStrategy: FILL, cornerRadius: 20, quality: 90,format: PNG })
        }
        title
        publishDate
        vimeoUrl
        category
        keyword
        year
        casts
        place
        season
        timestamp
        description{
          json
        }
      }
    }
  }
`

// Archive Dynamic Route Paths
export const query_archiveRoute =
  `{
  archivePathCollection {
    items {
      sys {
        id
      }
      archiveRouteArray
    }
  }
}`

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
  twitterCollection(order:order_ASC){
    items{
      sys{
        id
      }
      name
      twitterId
      path
      order
    }
  }
}`

//// Instagram ////
export const query_instagram = `{
  instagramCollection(order:order_ASC){
    items{
      sys{
        id
      }
      name
      instagramTopUrl
      path
      order
      avatar {
        url(transform: { resizeStrategy: CROP, cornerRadius: -1 })
      }
    }
  }
}`

// How many photos to fetch
const num_photos = 16

export const query_instagram_image_official = `{
  instagramOfficialCollection(limit:${num_photos},order:sys_publishedAt_DESC) {
    items {
      sys {
        id
        publishedAt
      }
      image {
        url
      }
      instagramUrl
      id
    }
  }
}`

export const query_instagram_image_yappi = `{
  instagramUser1Collection(limit:${num_photos},order:sys_publishedAt_DESC) {
    items {
      sys {
        id
        publishedAt
      }
      image {
        url
      }
      instagramUrl
      id
    }
  }
}`

export const query_instagram_image_chansho = `{
  instagramUser2Collection(limit:${num_photos},order:sys_publishedAt_DESC) {
    items {
      sys {
        id
        publishedAt
      }
      image {
        url
      }
      instagramUrl
      id
    }
  }
}`

export const query_instagram_image_miyashi = `{
  instagramUser3Collection(limit:${num_photos},order:sys_publishedAt_DESC) {
    items {
      sys {
        id
        publishedAt
      }
      image {
        url
      }
      instagramUrl
      id
    }
  }
}`
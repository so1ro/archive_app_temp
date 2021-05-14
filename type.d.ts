interface UserMetadataContextInterface {
  User_Detail: object | null;
  Stripe_Customer_Detail: Stripe_Customer_Detail_Interface;
  error_metadata: string | null;
  isLoading_metadata: boolean | null;
  isBeforeCancelDate: boolean | null;
  temporaryCheckIsSubscribing: boolean | null;
  // setUserDetail:any, 
  // setStripeCustomerDetail:any, 
  // setErrorMetadata:any, 
  // setIsLoadingMetadata:any, 
  // setIsBeforeCancelDate:any, 
  setTemporaryCheckIsSubscribing: ({ temporaryCheckIsSubscribing: boolean }) => void;
}
interface SubscriptionPlanInterface {
  id: string | null;
  nickname: string | null;
}
interface Stripe_Customer_Detail_Interface {
  customer_Id: string | null;
  price_Id: string | null;
  subscription_Name: string | null;
  subscription_Id: string | null;
  subscription_Status: string | null;
  cancel_at_period_end: boolean | null;
  cancel_at: string | null;
  canceled_at: string | null;
}

// check-session.ts
// interface sessionInterface {
//   customer: string
// }

interface CustomerDataInterface {
  customer_email: string | null
  customer_auth0_UUID: string | null
  customer_price_Id: string | null
  isSubscribing: boolean | null
}

// Contentful queries
interface AllArchivesInterface {
  sys: { id: string };
  thumbnail: { url: string | null };
  title: string | null;
  publishDate: string | null;
  vimeoUrl: number | null;
  category: string[] | null;
  keyword: string[] | null;
  releasedYear: number | null;
  casts: string[] | null;
  place: string[] | null;
  season: string | null;
  expert: string[] | null;
}

interface AllHeroImgInterface {
  imageCollection: {
    items: {
      sys: { id: string };
      title: string | null;
      fileName: string | null;
      url: string | null;
      width: number | null;
    }
  }
}
interface TodayImgInterface {
  sys: { id: string };
  title: string | null;
  fileName: string | null;
  url: string | null;
  width: number | null;
}

interface TopIntroTextAvatar {
  sys: { id: string };
  text: string | null;
  avatar: { url: string | null };
}
interface TopShopTextImage {
  sys: { id: string };
  productName: string | null;
  productImage: { url: string | null };
  url: string | null;
}

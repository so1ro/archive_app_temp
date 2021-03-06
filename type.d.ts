interface UserMetadataContextInterface {
  User_Detail: object | null;
  isMetadataLoading: boolean | null;
  subscription_state: string | null;
  Subscription_Detail: Subscription_Detail_Interface;
  error_metadata: string | null;
  isBeforeCancelDate: boolean | null;
  temporaryPaidCheck: boolean | null;
  // setUserDetail:any, 
  // setStripeCustomerDetail:any, 
  // setErrorMetadata:any, 
  // setIsBeforeCancelDate:any, 
  // setIsLoadingMetadata: ({ isLoading_metadata: boolean }) => void;
  setTemporaryPaidCheck: ({ setTemporaryPaidCheck: boolean }) => void;
}
interface AllPrices {
  id: string | null;
  nickname: string | null;
  unit_amount: number | null;
  type: string | null;
  recurring: object | null;
  active: boolean | null;
  livemode: boolean | null;
}

interface ArchivePath {
  id: string;
  categoryName: string;
  paths: string[] | null;
};

interface Subscription_Detail_Interface {
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
}

// Contentful queries
interface AllArchivesInterface {
  sys: { id: string };
  thumbnail: { url: string | null };
  title: string | null;
  publishDate: string | null;
  vimeoId: number | null;
  youtubeId: string | null;
  category: string[] | null;
  keyword: string[] | null;
  releasedYear: string[] | null;
  casts: string[] | null;
  place: string[] | null;
  season: string[] | null;
  timestamp: { time: string | null, indexText: string | null }[];
  description: {
    json: any
  };
}

interface SearchedArchiveResultInterface {
  item: AllArchivesInterface;
  matches: Array | null;
  refIndex: number | null;
}
interface LandingPageText {
  sys: { id: string };
  message: string | null;
  content: object | null;
  functions: object | null;
  merit: object | null;
  vimeoId: string | null;
  explain: string | null;
  annotation: string | null;
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

// Twitter
interface TwitterCollectionItems {
  sys: { id: string };
  name: string | null;
  twitterId: string | null;
  path: string | null;
  order: number | null;
}

// Instagram
interface InstagramItem {
  sys: { id: string; }
  instagramTopUrl: string | null;
  name: string | null;
  order: number | null;
  path: string | null;
  avatar: { url: string | null; }
}

interface InstagramImage {
  id: string;
  image: { url: string; }
  instagramUrl: string | null;
  sys: {
    id: string;
    publishedAt: string;
  }
}

interface NavItem {
  id: string;
  name: string | null;
  path: string | null;
}
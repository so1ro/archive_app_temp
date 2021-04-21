interface userMetadataContextInterface {
    User_Detail : object | null;
    Stripe_Customer_Detail : object | null;
    error_metadata : string | null;
    isLoading_metadata : boolean | null;
    isBeforeCancelDate: boolean | null;
    temporaryCheckIsSubscribing: boolean | null;
    // setUserDetail:any, 
    // setStripeCustomerDetail:any, 
    // setErrorMetadata:any, 
    // setIsLoadingMetadata:any, 
    // setIsBeforeCancelDate:any, 
    setTemporaryCheckIsSubscribing: ({ temporaryCheckIsSubscribing: boolean}) => void ;
  }

  type useUserMetadataContextType = {
    userMetadataContextInterface
  }

  interface allArchivesInterface {
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
    expert:string[] | null ;
  }

  interface subscriptionPlanInterface {
    id: string | null;
    nickname: string | null;
  }
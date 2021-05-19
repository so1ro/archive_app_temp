import { useEffect, useState, createContext, useContext } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { postData } from '@/utils/helpers';
import { format, fromUnixTime, isBefore } from 'date-fns'

export const UserMetadataContext = createContext(null);

export const UserMetadataProvider = (props) => {

  const { user, isLoading: userIsLoading } = useUser();
  const [{ User_Detail }, setUserDetail] = useState<{ User_Detail: object }>({ User_Detail: null })
  const [{ Stripe_Customer_Detail }, setStripeCustomerDetail] = useState<{ Stripe_Customer_Detail: object }>({ Stripe_Customer_Detail: null })
  const [{ error_metadata }, setErrorMetadata] = useState<{ error_metadata: string }>({ error_metadata: '' })
  const [{ isLoading_metadata }, setIsLoadingMetadata] = useState<{ isLoading_metadata: boolean }>({ isLoading_metadata: true })
  const [{ isBeforeCancelDate }, setIsBeforeCancelDate] = useState<{ isBeforeCancelDate: boolean }>({ isBeforeCancelDate: false })
  // Temporary chec isSubscribing
  const [{ temporaryCheckIsSubscribing }, setTemporaryCheckIsSubscribing] = useState<{ temporaryCheckIsSubscribing: boolean }>({ temporaryCheckIsSubscribing: false })

  // useEffect(() => {
  //   // setIsLoadingMetadata({ isLoading_metadata: true })
  //   if (!user) setIsLoadingMetadata({ isLoading_metadata: false })
  // }, [])

  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      console.log('Get here!!');
      const getUserMetadata = async () => {
        try {
          const { user_metadata } = await postData({
            url: '/api/auth/fetch-user-metadata',
            data: { user_id: user.sub }
          }).then(data => data)

          if (user_metadata?.Stripe_Customer_Detail) {
            const { Stripe_Customer_Detail, ...User_Detail } = user_metadata
            setUserDetail({ User_Detail })
            setStripeCustomerDetail({ Stripe_Customer_Detail })

            // Check if Today is before the cancel day
            if (Stripe_Customer_Detail.cancel_at) {
              const today = new Date()
              const cancel_at = fromUnixTime(Stripe_Customer_Detail.cancel_at)
              const canceled_at = fromUnixTime(Stripe_Customer_Detail.canceled_at)
              Stripe_Customer_Detail.cancel_at = format(cancel_at, 'yyyy年 M月 d日 k時',)
              Stripe_Customer_Detail.canceled_at = format(canceled_at, 'yyyy年 M月 d日',)
              setIsBeforeCancelDate({ isBeforeCancelDate: isBefore(today, cancel_at) })
            }
          }
        } catch (error) {
          setErrorMetadata({ error_metadata: error.message })
          throw new Error(error)

        } finally {
          setIsLoadingMetadata({ isLoading_metadata: false })
        }
      }
      getUserMetadata();
    }
  }, [user]);

  const value = {
    User_Detail,
    Stripe_Customer_Detail,
    error_metadata,
    isLoading_metadata,
    isBeforeCancelDate,
    temporaryCheckIsSubscribing,
    setIsLoadingMetadata,
    setTemporaryCheckIsSubscribing,
  }
  return <UserMetadataContext.Provider value={value} {...props} />;
};

export const useUserMetadata = () => {
  const context = useContext(UserMetadataContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserContextProvider.`);
  }
  return context;
};
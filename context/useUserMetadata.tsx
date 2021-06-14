import { useEffect, useState, createContext, useContext } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { postData } from '@/utils/helpers';
import { format, fromUnixTime, isBefore } from 'date-fns'

export const UserMetadataContext = createContext(null);

export const UserMetadataProvider = (props) => {

  const { user, isLoading } = useUser();
  const [{ isMetadataLoading }, setIsMetadataLoading] = useState<{ isMetadataLoading: boolean }>({ isMetadataLoading: false })
  const [{ User_Detail }, setUserDetail] = useState<{ User_Detail: object }>({ User_Detail: null })
  const [{ Stripe_Customer_Detail }, setStripeCustomerDetail] = useState<{ Stripe_Customer_Detail: object }>({ Stripe_Customer_Detail: null })
  const [{ error_metadata }, setErrorMetadata] = useState<{ error_metadata: string }>({ error_metadata: '' })
  const [{ isBeforeCancelDate }, setIsBeforeCancelDate] = useState<{ isBeforeCancelDate: boolean }>({ isBeforeCancelDate: false })

  // Subscription State "subscribe" OR "unsubscribe"
  const [{ subscription_state }, setSubscriptionState] = useState<{ subscription_state: string }>({ subscription_state: null })
  // Temporary check isSubscribing for after Payment and check via returning URL
  const [{ temporaryCheckIsSubscribing }, setTemporaryCheckIsSubscribing] = useState<{ temporaryCheckIsSubscribing: boolean }>({ temporaryCheckIsSubscribing: false })

  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      setIsMetadataLoading({ isMetadataLoading: true })
      const getUserMetadata = async () => {
        try {
          const { user_metadata } = await postData({
            url: '/api/auth/fetch-user-metadata',
            data: { user_id: user.sub }
          }).then(data => data)

          if (!user_metadata.Stripe_Customer_Detail) {
            setSubscriptionState({ subscription_state: 'unsubscribe' })
            setIsMetadataLoading({ isMetadataLoading: false })
            const { ...User_Detail } = user_metadata
            setUserDetail({ User_Detail })
          }

          if (user_metadata?.Stripe_Customer_Detail) {
            const { Stripe_Customer_Detail, ...User_Detail } = user_metadata
            setUserDetail({ User_Detail })
            setStripeCustomerDetail({ Stripe_Customer_Detail })

            setIsMetadataLoading({ isMetadataLoading: false })
            Stripe_Customer_Detail.subscription_Status === ('active' || 'trialing') ?
              setSubscriptionState({ subscription_state: 'subscribe' }) :
              setSubscriptionState({ subscription_state: 'unsubscribe' })

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
        }
        finally {
          setIsMetadataLoading({ isMetadataLoading: false })
        }
      }
      getUserMetadata();
    }
    setSubscriptionState({ subscription_state: 'unsubscribe' })
  }, [user]);

  const value = {
    User_Detail,
    isMetadataLoading,
    subscription_state,
    Stripe_Customer_Detail,
    error_metadata,
    isBeforeCancelDate,
    temporaryCheckIsSubscribing,
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
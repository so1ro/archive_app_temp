import { useEffect, useState, createContext, useContext } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { postData } from '@/utils/helpers';
import { format, fromUnixTime, isBefore } from 'date-fns'

export const UserMetadataContext = createContext();

export const UserMetadataProvider = (props) => {

  const { user } = useUser();
  const [{ User_Detail }, setUserDetail] = useState({ User_Detail: undefined })
  const [{ Stripe_Customer_Detail }, setStripeCustomerDetail] = useState({ Stripe_Customer_Detail: undefined })
  const [{ error_metadata }, setErrorMetadata] = useState({ error_metadata: '' })
  const [{ isLoading_metadata }, setIsLoadingMetadata] = useState({ isLoading_metadata: true })
  const [{ isBeforeCancelDate }, setIsBeforeCancelDate] = useState({ isBeforeCancelDate: false })

  useEffect(() => {
    if (user) {
      setIsLoadingMetadata({ isLoading_metadata: true })
      const getUserMetadata = async () => {
        try {
          const { user_metadata } = await postData({
            url: '/api/auth/fetch-user-metadata',
            data: { user_id: user.sub }
          }).then(data => data)

          const { Stripe_Customer_Detail, ...User_Detail } = user_metadata
          setUserDetail({ User_Detail })
          setStripeCustomerDetail({ Stripe_Customer_Detail })

          // Check if Today is before the cancel day
          if (Stripe_Customer_Detail.cancel_at) {
            const today = new Date()
            const cancel_at = fromUnixTime(Stripe_Customer_Detail.cancel_at)
            const canceled_at = fromUnixTime(Stripe_Customer_Detail.canceled_at)
            Stripe_Customer_Detail.cancel_at = format(cancel_at, 'yyyy年 M月 d日',)
            Stripe_Customer_Detail.canceled_at = format(canceled_at, 'yyyy年 M月 d日',)
            setIsBeforeCancelDate({ isBeforeCancelDate: isBefore(today, cancel_at) })
          }

        } catch (error) {
          setUserDetail({ User_Detail: undefined })
          setStripeCustomerDetail({ Stripe_Customer_Detail: undefined })
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

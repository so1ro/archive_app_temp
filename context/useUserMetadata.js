import { useEffect, useState, createContext, useContext } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { postData } from '@/utils/helpers';

export const UserMetadataContext = createContext();

export const UserMetadataProvider = (props) => {

  const { user } = useUser();
  const [{ User_Detail }, setUserDetail] = useState({ User_Detail: undefined })
  const [{ Stripe_Customer_Detail }, setStripeCustomerDetail] = useState({ Stripe_Customer_Detail: undefined })

  useEffect(() => {
    if (user) {
      const getUserMetadata = async () => {
        try {
          const { user_metadata } = await postData({
            url: '/api/auth/fetch-user-metadata',
            data: { user_id: user.sub }
          }).then(data => data)

          const { Stripe_Customer_Detail, ...User_Detail } = user_metadata
          setUserDetail({ User_Detail })
          setStripeCustomerDetail({ Stripe_Customer_Detail })

        } catch (error) {
          setUserDetail({ User_Detail: undefined })
          setStripeCustomerDetail({ Stripe_Customer_Detail: undefined })
          throw new Error(error)
        }
      }
      getUserMetadata();
    }
  }, [user]);

  const value = {
    User_Detail,
    Stripe_Customer_Detail,
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

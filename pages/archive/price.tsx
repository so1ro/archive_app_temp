import { useState, useEffect } from 'react'
import Head from 'next/head'
import styles from '@/styles/Home.module.css'

import { useUser } from '@auth0/nextjs-auth0'
import PriceList from '@/components/PriceList'
import { fetchSubscriptionPlans } from '@/hook/getStaticProps'
import { GetStaticProps } from 'next'

export default function Price({ subscriptionPlans }: { subscriptionPlans: SubscriptionPlanInterface[] }) {

    const { user, error, isLoading } = useUser()

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>{error.message}</div>
    if (user) {
        return (
            <div className={styles.container}>
                <main className={styles.main}>
                    <div>
                        Welcome {user.name}! <a href="/api/auth/logout">Logout</a>
                    </div>
                    <PriceList user={user} subscriptionPlans={subscriptionPlans} />
                </main>
            </div>
        )
    }
    return (<a href="/api/auth/login">Login</a>)

}

export const getStaticProps: GetStaticProps = async () => {
    // get Subscription Plans from Stripe
    return await fetchSubscriptionPlans()
}
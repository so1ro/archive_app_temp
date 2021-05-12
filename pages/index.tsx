import Hero from '@/components/Hero';
import { useUser } from '@auth0/nextjs-auth0'
import { GetStaticProps } from "next"

import { fetchContentful } from "@/hook/contentful"
import { query_allHeroImg } from "@/hook/contentful-queries"
import { dailyNum } from '@/utils/helpers';

export default function Home({ allHeroImg }: { allHeroImg: AllHeroImgInterface[] }) {

  const todayImg = allHeroImg[dailyNum(allHeroImg)].imageCollection.items
  const { user, error, isLoading } = useUser();

  return (
    <main>
      <Hero todayImg={todayImg} />
      {user && <div> Welcome {user.name}! <a href="/api/auth/logout">Logout</a> </div>}
      {isLoading && <div>Loading...</div>}
      {error && <div>{error.message}</div>}
      {!user && <div><a href="/api/auth/login">Login</a></div>}
    </main>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  // get Archivce data from Contentful
  const data = await fetchContentful(query_allHeroImg)

  return {
    props: {
      allHeroImg: data.topHeroImgsCollection.items,
    },
    revalidate: 1,
  }
}
import Hero from '@/components/Hero';
import { useUser } from '@auth0/nextjs-auth0'
import { GetStaticProps } from "next"

import { fetchContentful } from "@/hook/contentful"
import { query_allHeroImg, query_topIntro } from "@/hook/contentful-queries"

import { Container, VStack } from "@chakra-ui/react"
import TopIntro from '../components/TopIntro';


export default function Home(
  {
    allHeroImg,
    introTextAvatar
  }: {
    allHeroImg: AllHeroImgInterface[],
    introTextAvatar: TopIntroTextAvatar
  }) {

  const { user, error, isLoading } = useUser();

  return (
    <main>
      <Hero allHeroImg={allHeroImg} />
      <Container maxW='1000px'>
        <VStack spacing={16} py={16}>
          <TopIntro introTextAvatar={introTextAvatar} />
        </VStack>
      </Container>
      {/* {user && <div> Welcome {user.name}! <a href="/api/auth/logout">Logout</a> </div>}
      {isLoading && <div>Loading...</div>}
      {error && <div>{error.message}</div>}
      {!user && <div><a href="/api/auth/login">Login</a></div>} */}
    </main>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  // get Archivce data from Contentful
  const { topHeroImgsCollection: { items: allHeroImg } } = await fetchContentful(query_allHeroImg)
  const { topIntroCollection: { items: introTextAvatar } } = await fetchContentful(query_topIntro)

  return {
    props: {
      allHeroImg,
      introTextAvatar: introTextAvatar[0]
    },
    revalidate: 30,
  }
}
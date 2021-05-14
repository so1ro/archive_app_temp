import Hero from '@/components/Hero';
import { useUser } from '@auth0/nextjs-auth0'
import { GetStaticProps } from "next"

import { fetchContentful } from "@/hook/contentful"
import { query_allHeroImg, query_topIntro, query_topShop } from "@/hook/contentful-queries"

import { Container, VStack } from "@chakra-ui/react"
import TopIntro from '@/components/TopIntro';
import TopShop from '@/components/TopShop';


export default function Home(
  {
    allHeroImg,
    introTextAvatar,
    productTextImage
  }: {
    allHeroImg: AllHeroImgInterface[],
    introTextAvatar: TopIntroTextAvatar
    productTextImage: TopShopTextImage[]
  }) {

  const { user, error, isLoading } = useUser();

  return (
    <main>
      <Hero allHeroImg={allHeroImg} />
      <Container maxW='1000px'>
        <VStack spacing={16} py={16}>
          <TopIntro introTextAvatar={introTextAvatar} />
          <TopShop productTextImage={productTextImage} />
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
  const { topShopCollection: { items: productTextImage } } = await fetchContentful(query_topShop)

  return {
    props: {
      allHeroImg,
      introTextAvatar: introTextAvatar[0],
      productTextImage
    },
    revalidate: 30,
  }
}
import Image from 'next/image'
import { format, parseISO } from 'date-fns'

import { fetchFacebook } from '@/hook/facebook'

import { Grid, GridItem, Box, List, ListItem } from "@chakra-ui/react"
import { css } from '@emotion/react'

const Facebook = ({ facebookData }) => {
    console.log('facebookData:', facebookData)
    return (
        <>
            <div>Facebook</div>
            {/* <Grid templateColumns="1fr" gap={12} px={6}>
                {allArchives.map((archive) => (
                    <Grid key={archive.sys.id} templateColumns="repeat(2, 1fr)" gap={12}>
                        <Box overflow="hidden" css={imgBox}>
                            <Image
                                src={archive.thumbnail.url}
                                alt="Picture of the author"
                                width={640}
                                height={360} />
                        </Box>
                        <Box>
                            <List m={0} p={0}>
                                <ListItem>{archive.title}</ListItem>
                                <ListItem color='#585858' size="10px">{format(parseISO(archive.publishDate), 'yyyy/MM/dd')}</ListItem>
                            </List>
                        </Box>
                    </Grid>
                ))}
            </Grid> */}
        </>
    )
}

export async function getStaticProps() {
    const data = await fetchFacebook()
    // console.log('data:', data)
    return {
        props: {
            facebookData: data,
        },
        revalidate: 1,
    }
}

const imgBox = css`
  img {
    border-radius: 0.4rem;
  }
`

export default Facebook
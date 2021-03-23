import Image from 'next/image'
import { format, parseISO } from 'date-fns'
import { Grid, GridItem, Box, List, ListItem } from "@chakra-ui/react"

import { fetchContentful } from '@/hook/contentful-hook'
import { query_allArchives } from '@/hook/contentful-queries'

const Archive = ({ allArchives }) => {
    console.log('allArchives:', allArchives)
    return (
        <>
            <div>
                Archives
            </div>
            <Grid templateColumns="1fr" gap={12} px={6}>
                {allArchives.map((archive) => (
                    <Grid key={archive.sys.id} templateColumns="repeat(2, 1fr)" gap={12}>
                        <Box borderRadius={6} overflow="hidden" >
                            <Image
                                src={archive.thumbnail.url}
                                alt="Picture of the author"
                                width={640}
                                height={360}
                            />
                        </Box>
                        <Box>
                            <List m={0} p={0}>
                                <ListItem>{archive.title}</ListItem>
                                <ListItem color='#585858' size="10px">{format(parseISO(archive.publishDate), 'yyyy/MM/dd')}</ListItem>
                            </List>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </>
    )
}

export async function getStaticProps() {
    const data = await fetchContentful(query_allArchives)
    return {
        props: {
            allArchives: data.kasumibroVideoCollection.items,
        },
        revalidate: 1,
    }
}

export default Archive
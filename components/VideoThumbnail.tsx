import Image from "next/image"
import { Box, Grid, List, ListItem } from '@chakra-ui/react'
import { format, parseISO } from "date-fns"
import { useRouter } from 'next/router'
import { useArchiveState } from '@/context/useArchiveState';

export default function VideoThumbnail({ archive, inVideoCompo, currentRoot, setSkipTime }) {

    const router = useRouter()
    const { setCurrentDisplayArchive } = useArchiveState()

    return (
        <Grid
            templateColumns={!inVideoCompo ? { base: "repeat(2, 1fr)", md: "1fr" } : { base: "1fr" }}
            gap={{ base: 4, md: 1 }}
            onClick={() => {
                setSkipTime !== null && setSkipTime({ skipTime: 0 })
                setCurrentDisplayArchive({ currentDisplayArchive: archive })
                router.push(`${currentRoot}/?id=${archive.sys.id}`, null, { shallow: true })
            }}
        >
            <Box overflow="hidden">
                <Image
                    src={archive.thumbnail.url}
                    alt="Picture of the author"
                    width={640}
                    height={360}
                />
            </Box>
            <Box>
                <List m={0} p={0} fontSize={['xs', 'sm', 'md']}>
                    <ListItem fontSize={inVideoCompo && 'xs'}>{archive.title}</ListItem>
                    {!inVideoCompo && <ListItem color="#585858" size="10px">
                        {format(parseISO(archive.publishDate), "yyyy/MM/dd")}
                    </ListItem>}
                </List>
            </Box>
        </Grid>

    );
}
import Image from "next/image"
import { Box, Grid, List, ListItem, useColorModeValue } from '@chakra-ui/react'
import { format, parseISO } from "date-fns"
import { useRouter } from 'next/router'
import { useArchiveState } from '@/context/useArchiveState'
import { css } from "@emotion/react"
import { highlight_color } from '@/styles/colorModeValue';

export default function VideoThumbnail({ archive, inVideoCompo, currentRoot, setSkipTime, playing }) {

    const router = useRouter()
    const { setCurrentDisplayArchive } = useArchiveState()

    const imgPlayingCss = css`
    img {
        border: 3px ${useColorModeValue(highlight_color.l, highlight_color.d)} solid!important;
        background: ${useColorModeValue(highlight_color.l, highlight_color.d)};
        border-radius: 6px;
    }
    `

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
            <Box overflow="hidden" css={playing && imgPlayingCss}>
                <Image
                    src={archive.thumbnail.url}
                    alt="Picture of the author"
                    width={640}
                    height={360}
                />
            </Box>
            <Box>
                <List m={0} p={0} fontSize={['xs', 'sm', 'md']}>
                    <ListItem fontSize={inVideoCompo && 'xs'} mb={1}>{archive.title}</ListItem>
                    {!inVideoCompo && <ListItem color="#585858" fontSize='sm'>
                        {format(parseISO(archive.publishDate), "yyyy/MM/dd")}
                    </ListItem>}
                </List>
            </Box>
        </Grid>
    )
}

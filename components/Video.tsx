import { useState, useRef, useLayoutEffect } from 'react'
import { useRouter } from 'next/router'
import { useArchiveState } from '@/context/useArchiveState'
import { useUser } from '@auth0/nextjs-auth0'

import { format, parseISO } from "date-fns"
import TimeFormat from 'hh-mm-ss'
import { arrayProceedHandler, postData } from '@/utils/helpers'
import _ from 'lodash'

import {
    Box, Grid, List, ListItem, HStack, Link, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, useColorModeValue, Stack, useToast
} from '@chakra-ui/react'
import { Toast, ToastError } from '@/components/Toast'
import { highlight_color, bg_color } from '@/styles/colorModeValue'
import { css } from "@emotion/react"

import VideoVimeo from '@/components/VideoVimeo'
import VideoYouTube from '@/components/VideoYouTube'
import VideoThumbnail from '@/components/VideoThumbnail'
import { ChevronLeftIcon, RepeatIcon } from '@chakra-ui/icons'

//Contentful
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, INLINES } from '@contentful/rich-text-types'
import { useUserMetadata } from '@/context/useUserMetadata'
import { FavoriteHeartIcon } from '@/styles/icons'

export default function Video({
    selectedArchive,
    currentRoot,
}) {

    // Hook
    const router = useRouter()
    const route = router.pathname.split('/')[1]
    const {
        isAutoplay,
        setIsAutoplay,
        setIsVideoMode,
        currentDisplayArchive,
        setCurrentDisplayArchive,
    } = useArchiveState()
    const toast = useToast()
    const { user } = useUser()
    const { favoriteVideo, setFavoriteVideo } = useUserMetadata()

    // When refreshing browser, currentDisplayArchive is missing. 
    // Fallback here with router query.
    const currentId = router.query.id as string
    const displayingArchive = currentDisplayArchive ?? selectedArchive.find(archive => archive.sys.id === currentId)

    //State
    const [{ skipTime }, setSkipTime] = useState<{ skipTime: number }>({ skipTime: 0 })
    const [{ isQuitVideo }, setIsQuitVideo] = useState<{ isQuitVideo: boolean }>({ isQuitVideo: false })
    const publishedDate = format(parseISO(displayingArchive.publishDate), "yyyy/MM/dd")

    // Contentful
    const richtext_options = {
        renderNode: {
            [BLOCKS.PARAGRAPH]: (node, children) => {
                return <Text whiteSpace='pre-wrap' mb={4}>{children}</Text>
            },
            [INLINES.HYPERLINK]: (node, children) => {
                return <Link href={node.data.uri} color={highlight_color} isExternal>{children}</Link>
            },
        }
    }

    // Initial position of Thumbnail in Video
    const thumbnailWrap = useRef(null)
    const scrollThumbnailRef = useRef(null)
    useLayoutEffect(() => {
        thumbnailWrap.current.scrollLeft = scrollThumbnailRef.current.offsetLeft - thumbnailWrap.current.offsetLeft
    }, [displayingArchive])

    // Functions
    const routerPushHandler = () => {
        const nextVideo = arrayProceedHandler(selectedArchive, displayingArchive)
        const nextVideoId = arrayProceedHandler(selectedArchive, displayingArchive).sys.id
        setSkipTime({ skipTime: 0 })
        if (isAutoplay) {
            setCurrentDisplayArchive({ currentDisplayArchive: nextVideo })
            router.push(`${currentRoot}/?id=${nextVideoId}`, null, { shallow: true })
        }
    }

    const favoriteHandler = (vimeoId) => {
        const currentFavoriteVideo = favoriteVideo
        favoriteVideo.includes(vimeoId) ? _.pull(currentFavoriteVideo, vimeoId) : currentFavoriteVideo.unshift(vimeoId)
        setFavoriteVideo({ favoriteVideo: currentFavoriteVideo })
    }

    // Miscellaneous
    const favoriteButtonText = favoriteVideo.includes(displayingArchive.vimeoId) ? 'お気に入りから削除中...' : 'お気に入りに保存中...'
    const highLightColor = useColorModeValue(highlight_color.l, highlight_color.d)
    const bgColor = useColorModeValue(bg_color.l, bg_color.d)
    const accordionCss = css`
        .chakra-accordion__item:last-of-type {
        border-bottom-width: 0;
        }
    `
    const thumbnailAreaScrollCss = css`
        /* height */
        ::-webkit-scrollbar {
            height: 4px;
        }
        
        /* Track */
        ::-webkit-scrollbar-track {
            background:  ${bgColor};
        }
        
        /* Handle */
        ::-webkit-scrollbar-thumb {
            background: #888;
            border-radius : 4px
        }

        /* Handle on hover */
        ::-webkit-scrollbar-thumb:hover {
            background: ${highLightColor};
        }
    `
    const iconSize = { base: 6, md: 7 }

    return (
        <>
            <Stack direction={{ base: 'column' }} align='center' >
                <Box w='full' maxW={{ base: '1000px', '2xl': '1280px' }}>
                    <HStack
                        mb={2} spacing='0' align='center' cursor='pointer' pt={2}
                        onClick={() => {
                            const paths = router.query.path as string[]
                            router.push(`/${route}/${encodeURI(paths.join('/'))}`)
                            setIsVideoMode({ isVideoMode: false })
                        }}>
                        <ChevronLeftIcon w={8} h={8} />
                        <Text d={{ base: 'none', xl: 'inline-block' }}>戻る</Text>
                    </HStack>
                    {/* <Grid> */}
                    {route === 'archive' &&
                        <VideoVimeo
                            vimeoId={displayingArchive?.vimeoId}
                            aspect={null}
                            autoplay={true}
                            borderRadius={0}
                            skipTime={skipTime}
                            isQuitVideo={isQuitVideo}
                            onRouterPush={routerPushHandler} />}
                    {route === 'youtube1' &&
                        <VideoYouTube
                            youtubeId={displayingArchive?.youtubeId}
                            aspect={null}
                            autoplay={true}
                            borderRadius={0}
                            skipTime={skipTime}
                            isQuitVideo={isQuitVideo}
                            onRouterPush={routerPushHandler} />}
                    {/* </Grid> */}

                    <Box px={{ base: 4, 'xl': 0 }} py={4}>
                        <Grid
                            templateColumns={{ base: "1fr", md: "auto 80px" }}
                            gap={1}
                            pb={4}
                        >
                            <Box>
                                <List m={0} p={0}>
                                    <ListItem fontSize={{ base: 'xl', lg: '2xl' }} mb={1}>{displayingArchive.title}</ListItem>
                                    <ListItem color="#585858" size="10px" fontSize={['sm']} >
                                        {publishedDate}
                                    </ListItem>
                                </List>
                            </Box>
                            <HStack overflow="hidden" textAlign='right' spacing={2} justifySelf={{ base: 'start', md: 'end' }} alignItems='flex-start' pt={1}>
                                {route === 'archive' && <FavoriteHeartIcon
                                    width={iconSize} height={iconSize} cursor='pointer'
                                    color={favoriteVideo.includes(displayingArchive.vimeoId) && highLightColor}
                                    onClick={async () => {
                                        toast({ duration: 3000, render: () => (<Toast text={favoriteButtonText} />) })
                                        favoriteHandler(displayingArchive.vimeoId)
                                        try {
                                            const { data } = await postData({
                                                url: '/api/auth/upsert-favorite-video',
                                                data: { auth0_UUID: user.sub, favoriteVideo }
                                            }).then(data => data)
                                            // console.log('data:', data)
                                        } catch (error) {
                                            toast({ duration: 3000, render: () => (<ToastError text={'お気に入りは保存されませんでした。'} />) })
                                        }
                                    }} />}
                                <RepeatIcon
                                    width={iconSize} height={iconSize} cursor='pointer'
                                    onClick={() => {
                                        setIsAutoplay({ isAutoplay: !isAutoplay })
                                        toast({ duration: 3000, render: () => (<Toast text={!isAutoplay ? '自動再生がONになりました。' : '自動再生がOFFになりました。'} />) })
                                    }
                                    }
                                    color={isAutoplay && highLightColor} />
                            </HStack>
                        </Grid>
                        {/* Timestamps */}
                        {displayingArchive.timestamp && <Box pb={4}>
                            {displayingArchive.timestamp.map((stamp, i) => (
                                <List fontSize={['md']} key={i} >
                                    <ListItem fontSize={{ base: 'sm', lg: 'md' }}>
                                        <Link
                                            mr={2}
                                            color={highLightColor}
                                            onClick={async () => {
                                                setIsQuitVideo({ isQuitVideo: true })
                                                await setSkipTime({ skipTime: TimeFormat.toS(stamp.time) })
                                                setIsQuitVideo({ isQuitVideo: false })
                                            }}
                                        >{stamp.time}</Link>
                                        {stamp.indexText}
                                    </ListItem>
                                </List>
                            ))}
                        </Box>}
                        {/* Description with Contentful */}
                        {displayingArchive.description?.json && <Accordion css={accordionCss} allowToggle>
                            <AccordionItem mb={8} borderTopWidth={0} borderBottomWidth={0} >
                                <h2><AccordionButton p={0} justifyContent='center'><AccordionIcon /></AccordionButton></h2>
                                <AccordionPanel pb={4} px={0} fontSize={{ base: 'sm', lg: 'md' }}>
                                    {documentToReactComponents(displayingArchive.description.json, richtext_options)}
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>}
                        {/* Thumbnails in Category*/}
                        <List overflowX='auto' whiteSpace='nowrap' mt={8} pb={4} borderTopWidth='0' ref={thumbnailWrap} css={thumbnailAreaScrollCss}>
                            {selectedArchive.map((archive) => {
                                let refFlag = null
                                let styleFlag: boolean = false
                                if (archive.sys.id === displayingArchive.sys.id) {
                                    refFlag = scrollThumbnailRef
                                    styleFlag = true
                                }
                                return (
                                    <ListItem
                                        d='inline-block'
                                        w='180px'
                                        mr={3}
                                        whiteSpace='pre-wrap'
                                        cursor='pointer'
                                        _last={{ marginRight: 0 }}
                                        ref={refFlag} key={archive.sys.id}>
                                        <VideoThumbnail
                                            key={archive.sys.id}
                                            archive={archive}
                                            inVideoCompo={true}
                                            currentRoot={currentRoot}
                                            setSkipTime={setSkipTime}
                                            playing={styleFlag} />
                                    </ListItem>)
                            })}
                        </List>
                    </Box>
                </Box>
            </Stack>
        </>
    )
}
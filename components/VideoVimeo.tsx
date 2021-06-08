import { Box } from '@chakra-ui/react';
import Vimeo from '@u-wave/react-vimeo';
import { useRouter } from 'next/router'

export default function VideoVimeo({
    vimeoId,
    aspect,
    autoplay,
    borderRadius,
    skipTime,
    isQuitVideo,
    isAutoplay,
    nextVideoId,
    currentRoot }: {
        vimeoId: number | null,
        aspect: string | null,
        autoplay: boolean | null,
        borderRadius: number | null,
        skipTime: number | null,
        isQuitVideo: boolean | null,
        isAutoplay: boolean | null,
        nextVideoId: string | null,
        currentRoot: string | null,
    }) {

    const router = useRouter()

    return (
        // aspect ex) '52.7%' or null, default '56.25%'
        <Box
            w='full' h='0'
            pt={aspect ? aspect : '56.25%'}
            alignSelf='center'
            bg='#000'
            overflow='hidden'
            pos='relative'
            borderRadius={borderRadius ?? '12px'} >
            {/* 16:9の通常のビデオサイズの場合、ptは56.25% */}
            <Box w='100%' h='100%' pos='absolute' left='0' top='0'>
                {!isQuitVideo &&
                    <Vimeo
                        video={vimeoId}
                        responsive
                        width="100%"
                        autoplay={autoplay}
                        start={skipTime}
                        onEnd={() => {
                            isAutoplay && router.push(`${currentRoot}/?id=${nextVideoId}&isAutoplay=${isAutoplay}`, null, { shallow: true })
                        }}
                    />
                }
            </Box>
        </Box>
    );
}
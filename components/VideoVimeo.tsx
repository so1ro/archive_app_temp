import { Box } from '@chakra-ui/react';
import Vimeo from '@u-wave/react-vimeo';

export default function Video({ vimeoId, aspect, autoplay }: { vimeoId: string, aspect: string | null, autoplay: boolean | null }) {
    // aspect ex) '52.7%' or null, default '56.25%'
    return (
        <Box w='full' pt={aspect ? aspect : '56.25%'} h='0' alignSelf='center' bg='#000' overflow='hidden' pos='relative' borderRadius='12px' >
            {/* 16:9の通常のビデオサイズの場合、ptは56.25% */}
            <Box w='100%' h='100%' pos='absolute' left='0' top='0'>
                <Vimeo
                    video={vimeoId}
                    responsive={true}
                    width="100%"
                    autoplay={autoplay}
                /></Box>
        </Box>
    );
}
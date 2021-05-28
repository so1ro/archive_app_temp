import { useRef, useEffect } from 'react'
import { VStack, Box, Center } from "@chakra-ui/react"
import ScrollListTest from '@/components/ScrollListTest'

function Test() {

    return (
        <>
            <Box>Title</Box>
            <Box height={64} mt={1000}>Test</Box>
            <ScrollListTest />
        </>
    );
}

export default Test;
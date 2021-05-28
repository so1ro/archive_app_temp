import { useRef, useEffect } from 'react'
import { VStack, Box, Center } from "@chakra-ui/react"

export default function ScrollListTest() {

    const parent = useRef(null);
    const scrollBottomRef = useRef(null);
    const num = 2
    useEffect(() => { parent.current.scrollTop = scrollBottomRef.current.offsetTop - parent.current.offsetTop }, []);

    const data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

    return (
        <VStack height={64} overflowY='auto' ref={parent}>
            {data.map((d, i) => {
                let refCheck = null
                if (i === num) refCheck = scrollBottomRef
                return (<Box key={i} ref={refCheck}> <Center w="180px" h="80px" bg="red.200"> Box {d} </Center> </Box>)
            })}
        </VStack>
    );
}
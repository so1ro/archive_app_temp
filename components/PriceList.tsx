import { useRouter } from 'next/router'

import { postData } from '@/utils/helpers'
import { getStripe } from '@/utils/stripe-client'

import { Grid, Box, VStack, Text, HStack, useToast, Center, useColorMode, useColorModeValue, Flex } from '@chakra-ui/react'
import { MotionButton } from '@/components/Chakra_Framer/element'
import { price_card_color } from '@/styles/colorModeValue'
import { highlight_color } from '@/styles/colorModeValue'

export default function PriceList({ user, allPrices, annotation }) {

    const router = useRouter()
    const toast = useToast()

    const { colorMode } = useColorMode()
    const priceCardColor = useColorModeValue(price_card_color.l, price_card_color.d)
    const oneTimeCardColor = '#e63946'
    const cardBorder = colorMode === 'light' ? '1px' : '0px'

    const handleCheckout = async (price) => {
        // setPriceIdLoading(price.id)
        try {
            const { sessionId } = await postData({
                url: '/api/stripe/create-checkout-session',
                data: {
                    price,
                    user_uuid: user.sub,
                    user_email: user.email
                }
                // token: session.access_token
            })

            const stripe = await getStripe()
            stripe.redirectToCheckout({ sessionId })
        } catch (error) {
            return alert(error.message)
        } finally {
            // setPriceIdLoading(false)
        }
    }

    return (
        <div>
            <Grid gap={3} gridTemplateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }} mb={6}>
                {allPrices.map(price => (
                    <Flex
                        direction='column'
                        key={price.id}
                        color="gray.600" // pending
                        bg='#fff'
                        border={cardBorder}
                        borderTop='8px'
                        borderColor={price.type === "recurring" ? priceCardColor : oneTimeCardColor}
                        borderRadius={14}
                        align='center'
                    >
                        <HStack spacing={1} align='baseline' py={{ base: 2, md: 4 }}>
                            <Text letterSpacing='-1px' fontSize={{ base: '3xl', lg: '4xl' }}>{price.unit_amount}</Text>
                            <Text>{price.type === "recurring" ? '円／月' : '円'}</Text>
                        </HStack>
                        <Center fontSize='xs' py={0} color='#fff' w='full' bg={price.type === "recurring" ? priceCardColor : oneTimeCardColor}>
                            {price.type === "recurring" ? 'サブスクリプション' : 'ワンペイ永久ご視聴'}
                        </Center>
                        <Box px={6} py={6} flexGrow={1}>{price.nickname}</Box>
                        <Box pb={6}>
                            <MotionButton
                                borderRadius='full'
                                bg={price.type === "recurring" ? priceCardColor : oneTimeCardColor}
                                px={{ base: 4, md: 6 }}
                                py={2}
                                color='#fff'
                                fontSize={{ base: 'sm', lg: 'md' }}
                                fontWeight='normal'
                                _hover={{ bg: price.type === "recurring" ? priceCardColor : oneTimeCardColor }}
                                _active={{ bg: price.type === "recurring" ? priceCardColor : oneTimeCardColor }}
                                // Framer //
                                whileHover={{ scale: 1.1 }}
                                onClick={(e) => {
                                    if (user) {
                                        toast({
                                            title: "チェックアウトセッションに移動中...",
                                            description: "このまま少々お待ち下さい。",
                                            status: "success",
                                            duration: 9000,
                                            isClosable: true,
                                        })
                                        handleCheckout(price.id)
                                    } else {
                                        e.preventDefault()
                                        router.push("/api/auth/login?param=signup")
                                        // router.push({
                                        //     pathname: "/api/auth/login",
                                        //     query: { param: 'signup' },
                                        // })
                                    }
                                }}>
                                {user ? '購入' : 'サインアップ・購入'}
                            </MotionButton>
                        </Box>
                    </Flex>
                ))}
            </Grid>
            <Text fontSize={{ base: 'xs', md: 'sm' }} color={useColorModeValue(highlight_color.l, highlight_color.d)}>{annotation}</Text>
        </div>
    )
}


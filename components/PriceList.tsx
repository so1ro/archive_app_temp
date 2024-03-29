import { useRouter } from 'next/router'

import { postData } from '@/utils/helpers'
import { getStripe } from '@/utils/stripe-client'

import { Grid, Box, VStack, Text, HStack, useToast, Center, useColorMode, useColorModeValue, Flex, Link } from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'
import { MotionButton, MotionLink } from '@/components/Chakra_Framer/element'
import { price_card_color, highlight_color } from '@/styles/colorModeValue'

export default function PriceList({ user, allPrices, annotation, isOnePayPermanent }) {

    const toast = useToast()
    const { colorMode } = useColorMode()
    const priceCardColor = useColorModeValue(price_card_color.l, price_card_color.d)
    const oneTimeCardColor = '#e63946'
    const cardBorder = colorMode === 'light' ? '1px' : '0px'
    const highlighColor = useColorModeValue(highlight_color.l, highlight_color.d)
    const criteriaOnePayPrice = allPrices.find(price => price.type === 'one_time').unit_amount

    const handleCheckout = async (price, type) => {
        // setPriceIdLoading(price.id)
        try {
            const { sessionId } = await postData({
                url: '/api/stripe/create-checkout-session',
                data: {
                    price,
                    type,
                    user_uuid: user.sub,
                    user_email: user.email,
                    criteriaOnePayPrice
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

    // Compo in Compo
    const SignupPurchaseButton = ({ price }) => {

        const ConditionalButton = () => {
            return (
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
                        toast({
                            duration: 9000,
                            render: () => (
                                <HStack color="white" p={4} bg="#69b578" borderRadius={6} align='flex-start' spacing={4}>
                                    <CheckCircleIcon w={6} h={6} color="white" />
                                    <Box whiteSpace='pre-wrap'>
                                        {user ? "チェックアウトセッションに移動中..." : "サインアップに移動中..."}
                                    </Box>
                                </HStack>
                            )
                        })
                        if (user) handleCheckout(price.id, price.type)
                    }}>
                    {user ? '購入' : 'サインアップ・購入'}
                </MotionButton>
            )
        }

        if (user) return <ConditionalButton />
        return (
            <Link
                href="/api/auth/login?param=signup"
                color={highlighColor}
                fontSize={["10px", "11px"]}>
                <ConditionalButton />
            </Link>
        )
    }

    return (
        <div>
            <Grid gap={3} gridTemplateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }} mb={3}>
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
                        d={price.type !== "recurring" && isOnePayPermanent ? 'none' : 'flex'}
                    >
                        <HStack spacing={1} align='baseline' py={{ base: 2, md: 4 }}>
                            <Text letterSpacing='-1px' fontSize={{ base: '3xl', lg: '4xl' }}>{price.unit_amount}</Text>
                            <Text>{price.type === "recurring" ? '円／月' : '円'}</Text>
                        </HStack>
                        <Center fontSize='xs' py={0} color='#fff' w='full' bg={price.type === "recurring" ? priceCardColor : oneTimeCardColor}>
                            {price.type === "recurring" ? 'サブスクリプション' : 'ワンペイ永久ご視聴'}
                        </Center>
                        <Box px={6} py={6} flexGrow={1}>{price.nickname}</Box>
                        <Box pb={6}><SignupPurchaseButton price={price} /></Box>
                    </Flex>
                ))}
            </Grid>
            {!isOnePayPermanent && <Text fontSize={{ base: 'xs', md: 'sm' }} color={useColorModeValue(highlight_color.l, highlight_color.d)}>{annotation}</Text>}
        </div>
    )
}

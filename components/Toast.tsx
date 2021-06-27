import { CheckCircleIcon } from "@chakra-ui/icons"
import { Box, HStack } from "@chakra-ui/react"

export default function Toast({ text }) {
	return (
		<HStack color="white" p={4} bg="#69b578" borderRadius={6} align='flex-start' spacing={4}>
			<CheckCircleIcon w={6} h={6} color="white" /><Box whiteSpace='pre-wrap'>{text}</Box>
		</HStack>
	)
}
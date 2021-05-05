import { motion, HTMLMotionProps } from "framer-motion"
import { HTMLChakraProps, chakra } from "@chakra-ui/react"
import { Stack, forwardRef } from "@chakra-ui/react"

type Merge<P, T> = Omit<P, keyof T> & T;

// MotionLink
type MotionLinkProps = Merge<HTMLChakraProps<"a">, HTMLMotionProps<"a">>;
export const MotionLink: React.FC<MotionLinkProps> = motion(chakra.a);

// MotionIconStack
// type MotionIconStackProps = Merge<HTMLChakraProps<"div">, HTMLMotionProps<"div">>;
export const MotionIconStack = motion(Stack);


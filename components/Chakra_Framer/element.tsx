import { motion, HTMLMotionProps } from "framer-motion"
import { HTMLChakraProps, chakra } from "@chakra-ui/react"

// MotionLink
type Merge<P, T> = Omit<P, keyof T> & T;
type MotionLinkProps = Merge<HTMLChakraProps<"a">, HTMLMotionProps<"a">>;
export const MotionLink: React.FC<MotionLinkProps> = motion(chakra.a);


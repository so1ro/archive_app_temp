import { motion, HTMLMotionProps } from "framer-motion"
import { HTMLChakraProps, chakra } from "@chakra-ui/react"
import { Stack, Button } from "@chakra-ui/react"

type Merge<P, T> = Omit<P, keyof T> & T;

// MotionLink - Modal Menu
type MotionLinkProps = Merge<HTMLChakraProps<"a">, HTMLMotionProps<"a">>;
export const MotionLink: React.FC<MotionLinkProps> = motion(chakra.a);

// MotionButton - Top
type MotionButtonProps = Merge<HTMLChakraProps<"button">, HTMLMotionProps<"button">>;
export const MotionButton: React.FC<MotionButtonProps> = motion(chakra.button);
// export const MotionButton = motion(Button);

// MotionIconStack
// type MotionIconStackProps = Merge<HTMLChakraProps<"div">, HTMLMotionProps<"div">>;
export const MotionIconStack = motion(Stack);

// MotionIconBox - Top
type MotionIconBoxProps = Merge<HTMLChakraProps<"div">, HTMLMotionProps<"div">>;
export const MotionIconBox: React.FC<MotionIconBoxProps> = motion(chakra.div);
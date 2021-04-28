import { createIcon } from "@chakra-ui/icons"

export const SunIcon = createIcon({
    displayName: "SunIcon",
    viewBox: "0 0 22 22",
    // path can also be an array of elements, if you have multiple paths, lines, shapes, etc.
    path: (
        <path d="M10.75 0a.75.75 0 01.75.75v1a.75.75 0 01-1.5 0v-1a.75.75 0 01.75-.75zM10.75 5a5.75 5.75 0 100 11.5 5.75 5.75 0 000-11.5zM4.21 3.149a.75.75 0 00-1.061 1.06l.707.707a.75.75 0 101.06-1.06l-.707-.707zM21.5 10.75a.75.75 0 01-.75.75h-1a.75.75 0 010-1.5h1a.75.75 0 01.75.75zM18.351 4.21a.75.75 0 10-1.06-1.061l-.707.707a.75.75 0 101.06 1.06l.707-.707zM10.75 19a.75.75 0 01.75.75v1a.75.75 0 01-1.5 0v-1a.75.75 0 01.75-.75zM17.644 16.584a.75.75 0 10-1.06 1.06l.707.707a.75.75 0 101.06-1.06l-.707-.707zM2.5 10.75a.75.75 0 01-.75.75h-1a.75.75 0 010-1.5h1a.75.75 0 01.75.75zM4.916 17.644a.75.75 0 00-1.06-1.06l-.707.707a.75.75 0 001.06 1.06l.707-.707z" fill="#fff" />
    ),
})

export const MoonIcon = createIcon({
    displayName: "MoonIcon",
    viewBox: "0 0 16 16",
    // path can also be an array of elements, if you have multiple paths, lines, shapes, etc.
    path: (
        <path d="M4.77 3.962c0-1.032.151-2.074.538-2.962C2.736 2.12 1 4.747 1 7.73A7.27 7.27 0 008.27 15c2.984 0 5.61-1.736 6.73-4.308-.888.387-1.931.539-2.961.539a7.269 7.269 0 01-7.27-7.27z" fill="#000" />
    ),
})
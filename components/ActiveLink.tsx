import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function ActiveLink({ href, root, children }: { href: string, root: string, children: any }) {
    const router = useRouter()

    let className = children.props.className || ''
    const currentPaths = router.pathname.split('/')

    if (router.pathname === href || currentPaths[1] === root) {
        className = `${className} active`
    }

    return <Link href={href} passHref>{React.cloneElement(children, { className })}</Link>
}
import type React from "react"
export const Link = ({ children, href, ...props }: { children: React.ReactNode; href: string; [x: string]: any }) => {
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  )
}


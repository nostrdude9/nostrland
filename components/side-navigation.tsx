import { Button } from "@/components/ui/button"
import { Home, CreditCard, Send, Users, Gift } from "lucide-react"
import Link from "next/link"

const navigationItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: CreditCard, label: "Notes", href: "/notes" },
  { icon: Send, label: "Following", href: "/following" },
  { icon: Users, label: "Relays", href: "/relays" },
  { icon: Gift, label: "Share", href: "/share" },
]

export function SideNavigation() {
  return (
    <div className="fixed left-0 top-0 h-full w-[240px] border-r bg-white p-4">
      <div className="mb-8">
        <Link href="/" className="text-xl font-semibold">
          Nostr
        </Link>
      </div>
      <nav className="space-y-1">
        {navigationItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl"
            asChild
          >
            <Link href={item.href}>
              <item.icon className="mr-3 h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>
    </div>
  )
}


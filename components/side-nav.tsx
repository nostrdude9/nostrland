import { Button } from "@/components/ui/button"
import { Home, CreditCard, Send, Users, Gift } from "lucide-react"

const navItems = [
  { icon: Home, label: "Home" },
  { icon: CreditCard, label: "Card" },
  { icon: Send, label: "Payments" },
  { icon: Users, label: "Recipients" },
  { icon: Gift, label: "Earn £50" },
]

export function SideNav() {
  return (
    <div className="fixed left-0 top-0 h-full w-64 border-r bg-white p-4">
      <div className="mb-6 px-2">
        <img src="/placeholder.svg" alt="Logo" className="h-8" />
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Button key={item.label} variant="ghost" className="w-full justify-start text-gray-600 hover:text-gray-900">
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>
    </div>
  )
}


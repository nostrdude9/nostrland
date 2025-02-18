import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"

export function NavBar() {
  return (
    <div className="fixed top-0 right-0 left-64 h-16 border-b bg-white px-6 flex items-center justify-between z-10">
      <h1 className="text-xl font-semibold">Profile details</h1>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="text-gray-600">
          Why Nostr?
        </Button>
        <Button variant="ghost" size="sm" className="text-gray-600">
          What is Njump?
        </Button>
        <Button size="sm" className="bg-purple-500 hover:bg-purple-400 text-white">
          Join Nostr
        </Button>
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5 text-gray-500" />
        </Button>
      </div>
    </div>
  )
}


import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import type { NDKUser } from "@nostr-dev-kit/ndk"

interface ClientOption {
  name: string
  getUrl: (npub: string) => string
}

const clientOptions: ClientOption[] = [
  {
    name: "Jumble",
    getUrl: (npub) => `https://jumble.social/users/${npub}`,
  },
  {
    name: "Damus",
    getUrl: (npub) => `nostr:${npub}`,
  },
  {
    name: "Primal",
    getUrl: (npub) => `https://primal.net/p/${npub}`,
  },
  {
    name: "Amethyst",
    getUrl: (npub) => `https://astral.ninja/${npub}`,
  },
]

export function ClientLauncher({ user }: { user: NDKUser }) {
  const handleClientClick = (client: ClientOption) => {
    const url = client.getUrl(user.npub)
    window.open(url, "_blank")
  }

  return (
    <div className="space-y-2" role="region" aria-label="Open in client">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between rounded-full bg-white dark:bg-black"
            aria-label="Select client"
          >
            Open in
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          {clientOptions.map((client) => (
            <DropdownMenuItem key={client.name} onClick={() => handleClientClick(client)}>
              {client.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white"
        onClick={() => handleClientClick(clientOptions[0])}
        aria-label="Open in default app"
      >
        Your default app
      </Button>
    </div>
  )
}

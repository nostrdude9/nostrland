import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import type { NDKEvent } from "@nostr-dev-kit/ndk"
import * as nip19Utils from "@/lib/nip19"

interface HorizontalAppLauncherProps {
  note: NDKEvent
}

const apps = [
  { name: "Jumble", type: "web" },
  { name: "Damus", type: "web" },
  { name: "Primal", type: "web" },
  { name: "Amethyst", type: "mobile" }
]

export function HorizontalAppLauncher({ note }: HorizontalAppLauncherProps) {
  const getAppUrl = (app: string) => {
    const nevent = nip19Utils.encodeNevent({
      id: note.id,
      author: note.pubkey,
      kind: note.kind,
      relays: []
    })
    const noteId = nip19Utils.encodeNote(note.id)
    
    switch(app) {
      case "Jumble":
        return `https://jumble.social/notes/${nevent}`
      case "Damus":
        return `https://damus.io/${nevent}`
      case "Primal":
        return `https://primal.net/e/${noteId}`
      case "Amethyst":
        return `nostr:${nevent}`
      default:
        return `nostr:${nevent}`
    }
  }

  const handleAppClick = (appName: string) => {
    const url = getAppUrl(appName)
    window.open(url, "_blank")
  }

  const handleDefaultAppClick = () => {
    const url = `nostr:${nip19Utils.encodeNevent({
      id: note.id,
      author: note.pubkey,
      kind: note.kind,
      relays: []
    })}`
    window.open(url, "_blank")
  }

  return (
    <div className="flex gap-2 w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="flex-1">
          <Button variant="outline" className="justify-between w-full rounded-full">
            Open in
            <ChevronDown className="h-4 w-4 opacity-50 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          {apps.map((app) => (
            <DropdownMenuItem 
              key={app.name}
              onClick={() => handleAppClick(app.name)}
              className="cursor-pointer"
            >
              {app.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button 
        className="rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white"
        onClick={handleDefaultAppClick}
      >
        Your default app
      </Button>
    </div>
  )
}

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

const apps = ["Nostrrr", "Nosta", "Coracle", "Snort", "Nostter", "Nostrudel", "Primal"]

export function AppLauncher() {
  return (
    <div className="fixed right-6 top-20 w-48 space-y-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            Open in
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {apps.map((app) => (
            <DropdownMenuItem key={app}>{app}</DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button className="w-full bg-[#00B9FF] hover:bg-[#00A3E0] text-white">Your default app</Button>
    </div>
  )
}


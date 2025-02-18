import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Copy, ExternalLink } from "lucide-react"

export function ProfileDetails() {
  return (
    <div className="space-y-6">
      <Card className="border border-neutral-200 rounded-xl bg-white">
        <CardHeader className="border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-800">Account details</h2>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-1">
            <label className="text-sm text-neutral-500">Public Key</label>
            <div className="flex items-center gap-2">
              <Input
                value="npub1r0d8u8mnj6769500nypnm28a9hpk9qg8jr0ehe30tygr3wuhcnvs4rfsft"
                readOnly
                className="flex-1 rounded-full border border-neutral-200 bg-neutral-200 px-3 py-2 text-sm font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                className="text-neutral-500 border border-neutral-200 rounded-full bg-neutral-200"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-neutral-500">NIP-05 Address</label>
            <Input value="rb@rodbishop.nz" readOnly className="rounded-full border border-neutral-200 bg-neutral-200" />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-500">Active Relays</label>
            <div className="flex flex-wrap gap-2">
              {["nos.lol", "nostr.mom", "relay.damus.io", "nostrelites.org", "relay.nostr.band"].map((relay) => (
                <Badge
                  key={relay}
                  variant="outline"
                  className="bg-neutral-200 py-1 px-3 text-neutral-600 border border-neutral-200 rounded-full"
                >
                  {relay}
                  <ExternalLink className="ml-1.5 h-3 w-3" />
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-neutral-200 rounded-xl bg-white">
        <CardHeader className="border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-800">Settings</h2>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-medium text-neutral-700">Trusted Account</h3>
              <p className="text-sm text-neutral-500">Skip verification checks for faster interactions</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


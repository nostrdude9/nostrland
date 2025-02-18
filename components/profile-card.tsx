import { Card, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ProfileCard() {
  return (
    <Card className="mb-6 overflow-hidden bg-card">
      <CardHeader className="flex-row items-start space-x-4 space-y-0">
        <img
          src="https://sjc.microlink.io/K0Fp3Kn72RUKrV95DeZEBrBs9JIJTV9bDOE5hdhvRK3V_tsj_36iRlcqj45F7UreQpwhGP0sqqHOpHjjG4Bcmg.jpeg"
          alt="Profile"
          className="h-24 w-24 rounded-full object-cover border-2 border-border shadow-sm"
        />
        <div className="space-y-2">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">rodbishop</h2>
            <p className="text-sm text-muted-foreground">Rod</p>
          </div>
          <p className="text-sm text-card-foreground/80 max-w-2xl">
            Going down the #nostr rabbit hole. Startup founder and listco CEO, Jayride (ASX:JAY), Fishburners, #Bitcoin
            miner, New Zealander (kiwi) expat living in Australia, #nostr #austrich, dad.
          </p>
          <div className="flex flex-wrap gap-1">
            {["#nostr", "#bitcoin", "#austrich"].map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="cursor-pointer"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

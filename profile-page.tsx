"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Home, CreditCard, Send, Users, Gift, Copy, ExternalLink } from "lucide-react"
import { ChevronDownIcon } from "./chevron-down-icon" // Import the ChevronDownIcon component

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 border-r bg-white p-4">
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <CreditCard className="mr-2 h-4 w-4" />
            Card
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Send className="mr-2 h-4 w-4" />
            Payments
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Users className="mr-2 h-4 w-4" />
            Recipients
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Gift className="mr-2 h-4 w-4" />
            Earn £50
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Profile details</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Why Nostr?
            </Button>
            <Button variant="outline" size="sm">
              What is Njump?
            </Button>
            <Button variant="default" size="sm" className="bg-[#00B9FF] hover:bg-[#00A3E0]">
              Join Nostr
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader className="flex-row items-center space-x-4 space-y-0">
            <img
              src="https://sjc.microlink.io/K0Fp3Kn72RUKrV95DeZEBrBs9JIJTV9bDOE5hdhvRK3V_tsj_36iRlcqj45F7UreQpwhGP0sqqHOpHjjG4Bcmg.jpeg"
              alt="Profile"
              className="h-24 w-24 rounded-full"
            />
            <div>
              <CardTitle className="text-2xl">rodbishop</CardTitle>
              <p className="text-sm text-muted-foreground">Rod</p>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Going down the #nostr rabbit hole. Startup founder and listco CEO, Jayride (ASX:JAY), Fishburners,
                #Bitcoin miner, New Zealander (kiwi) expat living in Australia, #nostr #austrich, dad.
              </p>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="details" className="w-full">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="relays">Relays</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 font-semibold text-blue-600">Public Key</h3>
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-gray-100 px-2 py-1 text-sm">
                        npub1r0d8u8mnj6769500nypnm28a9hpk9qg8jr0ehe30tygr3wuhcnvs4rfsft
                      </code>
                      <Button variant="ghost" size="icon">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 font-semibold text-blue-600">NIP-05 Address</h3>
                    <p>rb@rodbishop.nz</p>
                  </div>

                  <div>
                    <h3 className="mb-2 font-semibold text-blue-600">Publishing to</h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "nos.lol",
                        "nostr.mom",
                        "relay.damus.io",
                        "nostrelites.org",
                        "relay.nostr.band",
                        "nostr.wine",
                      ].map((relay) => (
                        <Badge key={relay} variant="secondary" className="cursor-pointer">
                          {relay}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="relays">
            <Card>
              <CardContent className="pt-6">
                <p>Relay information will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Right side buttons */}
        <div className="fixed right-6 top-6 space-y-2">
          <Button variant="outline" className="w-full justify-between">
            Open in
            <ChevronDownIcon className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="default" className="w-full">
            Your default app
          </Button>
        </div>
      </div>
    </div>
  )
}


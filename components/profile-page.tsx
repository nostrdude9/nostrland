"use client"

import { useEffect, useState } from "react"
import NDK, { type NDKEvent, type NDKFilter, type NDKUser } from "@nostr-dev-kit/ndk"
import { NotesTimeline } from "./notes-timeline"
import { TechnicalDetails } from "./technical-details"
import { LeftSidebar } from "./left-sidebar"
import { ClientLauncher } from "./client-launcher"
import { Toaster } from "@/components/ui/toaster"
import { GlobalNavbar } from "./global-navbar"
import { useToast } from "@/components/ui/use-toast"
import { nip19 } from "nostr-tools"
import { decodeAny } from "@/lib/nip19"
import { CONFIG } from "@/lib/config"

function isValidId(input: string | undefined): string {
  if (!input) {
    throw new Error("Invalid or missing ID")
  }
  // First check existing npub format
  if (input.startsWith("npub1") && input.length === 63) {
    return input
  } 
  // Then check hex pubkey format
  else if (input.length === 64 && /^[0-9a-f]+$/i.test(input)) {
    return nip19.npubEncode(input)
  }
  // Finally try to decode as nprofile
  try {
    const decoded = decodeAny(input)
    if (decoded.type === 'nprofile') {
      const { pubkey } = decoded.data as { pubkey: string }
      return nip19.npubEncode(pubkey)
    }
  } catch (e) {
    // Ignore decode error and fall through to final error
  }
  throw new Error("Invalid npub or public key format")
}

export function ProfilePage({ id }: { id: string }) {
  const [ndk, setNdk] = useState<NDK | null>(null)
  const [user, setUser] = useState<NDKUser | null>(null)
  const [notes, setNotes] = useState<NDKEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const initNDK = async () => {
      setLoading(true)
      setError(null)
      try {
        console.log("Initializing NDK...")
        const newNdk = new NDK({ explicitRelayUrls: CONFIG.ndk.explicitRelayUrls })
        await newNdk.connect()
        console.log("NDK connected successfully")
        setNdk(newNdk)

        const validId = isValidId(id)

        console.log(`Fetching user profile for id: ${validId}`)
        const user = await newNdk.getUser({ npub: validId })
        if (!user) {
          throw new Error("User not found")
        }
        await user.fetchProfile()
        console.log("User profile fetched successfully", user)
        setUser(user)

        console.log("Fetching user notes...")
        const oneYearAgo = Math.floor((Date.now() - 365 * 24 * 60 * 60 * 1000) / 1000);
        const filter: NDKFilter = { 
          authors: [user.pubkey], 
          kinds: [1, 30023],
          since: oneYearAgo
        }
        const events = await newNdk.fetchEvents(filter)
        console.log(`Fetched ${events.size} notes`)
        setNotes(Array.from(events))
      } catch (error) {
        console.error("Error initializing NDK or fetching user data:", error)
        setError(`Error: ${error instanceof Error ? error.message : String(error)}`)
        toast({
          title: "Error",
          description: `Failed to load profile: ${error instanceof Error ? error.message : String(error)}`,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    initNDK()
  }, [id, toast])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalNavbar />
      <main className="container max-w-6xl mx-auto px-4 pt-24 pb-12" role="main" aria-label="User profile">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <LeftSidebar user={user} />
          </div>
          <div className="lg:col-span-2">
            <NotesTimeline notes={notes} user={user} ndk={ndk!} />
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <ClientLauncher user={user} />
              <TechnicalDetails user={user} />
            </div>
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  )
}

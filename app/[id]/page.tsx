"use client"

import { useEffect, useState } from "react"
import NDK, { type NDKEvent } from "@nostr-dev-kit/ndk"
import { NoteView } from "@/components/note-view"
import { Toaster } from "@/components/ui/toaster"
import { GlobalNavbar } from "@/components/global-navbar"
import { ProfilePage } from "@/components/profile-page"
import { useRouter } from "next/navigation"
import * as nip19Utils from "@/lib/nip19"
import { CONFIG } from "@/lib/config"

export default function DynamicPage({ params }: { params: { id: string } }) {
  const [ndk, setNdk] = useState<NDK | null>(null)
  const [note, setNote] = useState<NDKEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const initNDK = async () => {
      setLoading(true)
      setError(null)
      try {
        const newNdk = new NDK({ explicitRelayUrls: CONFIG.ndk.explicitRelayUrls })
        await newNdk.connect()
        setNdk(newNdk)

        if (params.id.length < 6) {
          throw new Error("Invalid ID: too short")
        }

        // Try to decode the ID as a NIP-19 entity
        try {
          const { type, data } = nip19Utils.decodeAny(params.id)
          
          switch (type) {
            case 'note':
            case 'nevent': {
              // For notes and events, fetch by ID
              const eventId = type === 'note' ? data : (data as any).id
              const event = await newNdk.fetchEvent(eventId)
              if (!event) throw new Error("Note not found")
              setNote(event)
              break
            }
            case 'naddr': {
              // For naddr, fetch by filter using kind, pubkey, and d tag
              const { kind, pubkey, identifier } = data as { kind: number; pubkey: string; identifier: string }
              const filter = {
                kinds: [kind],
                authors: [pubkey],
                '#d': identifier ? [identifier] : undefined
              }
              const events = await newNdk.fetchEvents(filter)
              const event = Array.from(events)[0]
              if (!event) throw new Error("Article not found")
              setNote(event)
              break
            }
            case 'nprofile':
              // For profiles, let ProfilePage handle it
              setNote(null)
              break
            case 'npub':
              // For public keys, let ProfilePage handle it
              setNote(null)
              break
            default:
              // If it's a 64-char hex, treat as note ID
              if (params.id.length === 64) {
                const event = await newNdk.fetchEvent(params.id)
                if (!event) throw new Error("Note not found")
                setNote(event)
              } else {
                // Otherwise, let ProfilePage try to handle it
                setNote(null)
              }
          }
        } catch (error) {
          // If decoding fails, check if it's a hex note ID
          if (params.id.length === 64) {
            const event = await newNdk.fetchEvent(params.id)
            if (event) {
              setNote(event)
            } else {
              throw new Error("Note not found")
            }
          } else {
            // Let ProfilePage try to handle it
            setNote(null)
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setError((error as Error).message || "An error occurred")
        // Redirect to home after a delay if there's an error
        setTimeout(() => {
          router.push("/")
        }, 3000)
      } finally {
        setLoading(false)
      }
    }

    initNDK()
  }, [params.id, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalNavbar />
        <main className="container max-w-3xl mx-auto px-4 pt-24 pb-12">
          <div className="flex items-center justify-center h-[200px]">Loading...</div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalNavbar />
        <main className="container max-w-3xl mx-auto px-4 pt-24 pb-12">
          <div className="flex items-center justify-center h-[200px] flex-col gap-4">
            <div className="text-red-500">Error: {error}</div>
            <div className="text-sm text-neutral-500">Redirecting to home...</div>
          </div>
        </main>
      </div>
    )
  }

  if (note) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalNavbar />
        <main className="container max-w-3xl mx-auto px-4 pt-24 pb-12">
          <NoteView note={note} ndk={ndk!} />
        </main>
        <Toaster />
      </div>
    )
  }

  return <ProfilePage id={params.id} />
}

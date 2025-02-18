"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import NDK from "@nostr-dev-kit/ndk"

interface NDKContextType {
  ndk: NDK | null
  error: Error | null
  isLoading: boolean
}

const NDKContext = createContext<NDKContextType | undefined>(undefined)

const RELAY_URLS = ["wss://relay.damus.io", "wss://relay.nostr.band", "wss://nos.lol", "wss://relay.snort.social"]

export function NDKProvider({ children }: { children: React.ReactNode }) {
  const [ndk, setNDK] = useState<NDK | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const initNDK = async () => {
      try {
        const newNDK = new NDK({
          explicitRelayUrls: RELAY_URLS,
        })

        await newNDK.connect()

        if (mounted) {
          setNDK(newNDK)
          setError(null)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error("Failed to initialize NDK"))
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    initNDK()

    return () => {
      mounted = false
      if (ndk) {
        ndk.pool.close()
      }
    }
  }, [ndk]) // Added ndk to the dependency array

  useEffect(() => {
    if (!ndk) return

    const handleDisconnect = () => {
      console.log("NDK disconnected. Attempting to reconnect...")
      ndk.connect().catch((err) => {
        console.error("Failed to reconnect:", err)
        setError(new Error("Failed to reconnect to relays"))
      })
    }

    ndk.pool.on("disconnect", handleDisconnect)

    return () => {
      ndk.pool.off("disconnect", handleDisconnect)
    }
  }, [ndk])

  return <NDKContext.Provider value={{ ndk, error, isLoading }}>{children}</NDKContext.Provider>
}

export function useNDK() {
  const context = useContext(NDKContext)
  if (context === undefined) {
    throw new Error("useNDK must be used within an NDKProvider")
  }
  return context
}


"use client"

import { useState, useEffect } from "react"
import NDK from "@nostr-dev-kit/ndk"
import { CONFIG } from "@/lib/config"

export function useNDK() {
  const [ndk, setNdk] = useState<NDK | null>(null)

  useEffect(() => {
    const initNDK = async () => {
      const newNdk = new NDK({ explicitRelayUrls: CONFIG.ndk.explicitRelayUrls })
      await newNdk.connect()
      setNdk(newNdk)
    }

    initNDK()
  }, [])

  return ndk
}


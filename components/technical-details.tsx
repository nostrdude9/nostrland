"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Copy, ExternalLink } from "lucide-react"
import type { NDKUser } from "@nostr-dev-kit/ndk"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function TechnicalDetails({ user }: { user: NDKUser }) {
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(user.npub)
      setIsCopied(true)
      toast({
        title: "Copied!",
        description: "Public key copied to clipboard",
        duration: 2000,
      })
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  // Get unique relays from user's relay list
  const relays = Array.from(new Set(user.relays || []))

  return (
    <div className="space-y-6">
      <Card className="border border-neutral-200 rounded-xl bg-white dark:bg-neutral-950 dark:border-neutral-800">
        <CardContent className="space-y-6 p-4">
          <div className="space-y-1">
            <label className="text-sm text-neutral-500 dark:text-neutral-400">Public Key</label>
            <div className="flex items-center gap-2">
              <Input
                value={user.npub}
                readOnly
                className="flex-1 rounded-full border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 px-3 py-2 text-sm font-mono dark:text-white"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-neutral-500 border border-neutral-200 rounded-full bg-white dark:bg-neutral-950 dark:border-neutral-700 dark:text-neutral-300"
                      onClick={handleCopy}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isCopied ? "Copied!" : "Copy"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {user.profile?.nip05 && (
            <div className="space-y-1">
              <label className="text-sm text-neutral-500 dark:text-neutral-400">NIP-05 Address</label>
              <Input
                value={user.profile?.nip05 || ""}
                readOnly
                className="flex-1 rounded-full border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 px-3 py-2 text-sm font-mono dark:text-white"
              />
            </div>
          )}

          {relays.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm text-neutral-500 dark:text-neutral-400">Active Relays</label>
              <div className="flex flex-wrap gap-2">
                {relays.map((relay) => (
                  <Badge
                    key={relay}
                    variant="outline"
                    className="bg-neutral-100 py-1 px-3 text-neutral-600 border border-neutral-200 rounded-full dark:bg-neutral-950 dark:border-neutral-800 dark:text-neutral-300"
                  >
                    {relay}
                    <ExternalLink className="ml-1.5 h-3 w-3" />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


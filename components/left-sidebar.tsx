"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Share2, Zap, Link } from "lucide-react"
import type { NDKUser } from "@nostr-dev-kit/ndk"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"

export function LeftSidebar({ user }: { user: NDKUser }) {
  const profile = user.profile || {}
  const { toast } = useToast()

  const handleZap = () => {
    const lightningAddress = profile.lud16 || profile.lud06
    if (lightningAddress) {
      window.open(`lightning:${lightningAddress}`, "_blank")
    } else {
      toast({
        title: "No Lightning Address",
        description: "This user hasn't set up a Lightning address.",
        variant: "destructive",
      })
    }
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/${user.npub}`
    try {
      await navigator.clipboard.writeText(url)
      toast({
        title: "URL Copied",
        description: "Profile URL has been copied to clipboard.",
      })
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy URL to clipboard.",
        variant: "destructive",
      })
    }
  }

  const handleWebsiteClick = () => {
    if (profile.website) {
      window.open(profile.website, "_blank")
    }
  }

  return (
    <div className="sticky top-24" role="complementary" aria-label="User information">
      <Card className="border border-neutral-200 shadow-none bg-white dark:bg-neutral-950 dark:border-neutral-800 rounded-xl overflow-hidden">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col items-center text-center">
            <div
              className="h-20 w-20 rounded-full border-2 border-white shadow-sm mb-2 bg-cover bg-center"
              style={{ backgroundImage: `url(${profile.image || "/placeholder.svg"})` }}
            />
            <h1 className="text-xl font-semibold text-neutral-800 dark:text-white">
              {profile.name || profile.displayName || user.npub}
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {profile.displayName !== profile.name ? profile.displayName : ""}
            </p>
          </div>

          <p className="text-sm text-neutral-600 dark:text-neutral-300 text-center">{profile.about}</p>

          <TooltipProvider>
            <div className="flex justify-center gap-2" role="group" aria-label="User actions">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-neutral-600 rounded-full bg-white dark:bg-neutral-950 dark:text-neutral-300"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share Profile</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-neutral-600 rounded-full bg-white dark:bg-neutral-950 dark:text-neutral-300"
                    onClick={handleZap}
                  >
                    <Zap className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zap</p>
                </TooltipContent>
              </Tooltip>

              {profile.website && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-neutral-600 rounded-full bg-white dark:bg-neutral-950 dark:text-neutral-300"
                      onClick={handleWebsiteClick}
                    >
                      <Link className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Website</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  )
}


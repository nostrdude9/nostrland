import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Share2, Bell } from "lucide-react"
import type { NDKUser } from "@nostr-dev-kit/ndk"

export function ProfileHeader({ user }: { user: NDKUser }) {
  const profile = user.profile || {}

  return (
    <Card className="border border-neutral-200 shadow-none bg-white rounded-xl">
      <div className="p-4">
        <div className="flex items-start gap-6">
          <div className="relative">
            <img
              src={profile.image || "/placeholder.svg"}
              alt="Profile"
              className="h-20 w-20 rounded-full border-2 border-white shadow-sm"
            />
            <div className="absolute -bottom-1 -right-1 rounded-full border-2 border-white bg-green-500 p-1.5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-neutral-800">
                  {profile.name || profile.displayName || user.npub}
                </h1>
                <p className="text-sm text-neutral-500">
                  {profile.displayName !== profile.name ? profile.displayName : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-neutral-600 border border-neutral-100 rounded-full bg-neutral-100"
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Follow
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-neutral-600 border border-neutral-100 rounded-full bg-neutral-100"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-neutral-600">{profile.about}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}


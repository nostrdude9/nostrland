import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { NDKEvent } from "@nostr-dev-kit/ndk"
import { useRouter } from "next/navigation"
import { HorizontalAppLauncher } from "@/components/horizontal-app-launcher"
import { sanitizeInput } from "@/lib/sanitize"
import { formatTimeAgo } from "@/lib/utils"
import { MarkdownContent } from "@/components/ui/markdown-content"
import * as nip19Utils from "@/lib/nip19"
import { useToast } from "@/components/ui/use-toast"

interface LongFormContentProps {
  event: NDKEvent
}

export function LongFormContent({ event }: LongFormContentProps) {
  const router = useRouter()
  const { toast } = useToast()
  
  // Get metadata from tags according to NIP-23
  const title = event.tags.find(t => t[0] === "title")?.[1]
  const summary = event.tags.find(t => t[0] === "summary")?.[1]
  const image = event.tags.find(t => t[0] === "image")?.[1]
  const publishedAt = event.tags.find(t => t[0] === "published_at")?.[1]
  
  // Get the article identifier
  const identifier = event.tags.find(t => t[0] === "d")?.[1]

  return (
    <Card
      className="cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => router.push(`/${event.id}`)}
      role="article"
      aria-label="Long-form content"
    >
      <CardHeader className="space-y-4">
        <HorizontalAppLauncher note={event} />
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <CardTitle>{title ? sanitizeInput(title) : "Untitled Article"}</CardTitle>
          </div>
          {publishedAt && (
            <time className="text-sm text-muted-foreground">
              {formatTimeAgo(new Date(parseInt(publishedAt) * 1000))}
            </time>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div>
          {summary && <p className="text-base font-semibold mb-4">{sanitizeInput(summary)}</p>}
          {image && (
            <img
              src={image ? sanitizeInput(image) : "/placeholder.svg"}
              alt={title ? sanitizeInput(title) : "Article image"}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
          )}
          <div className="line-clamp-3" aria-label="Content preview">
            <MarkdownContent 
              content={event.content ? sanitizeInput(event.content).substring(0, 300) : ""}
              className="text-base space-y-4"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

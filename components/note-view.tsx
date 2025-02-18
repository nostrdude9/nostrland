"use client"

import { ArrowLeft, Repeat } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { HorizontalAppLauncher } from "@/components/horizontal-app-launcher"
import NDK from "@nostr-dev-kit/ndk"
import type { NDKEvent } from "@nostr-dev-kit/ndk"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import * as nip19Utils from "@/lib/nip19"
import { sanitizeInput, sanitizeHtml } from "@/lib/sanitize"
import { formatTimeAgo } from "@/lib/utils"
import { MarkdownContent } from "@/components/ui/markdown-content"

interface NoteViewProps {
  note: NDKEvent
  ndk: NDK
}

async function getEntityUsername(ndk: NDK, pubkey: string): Promise<string> {
  try {
    const user = await ndk.getUser({ pubkey })
    if (!user.profile?.name && !user.profile?.displayName) {
      await user.fetchProfile()
    }
    return user.profile?.name || user.profile?.displayName || nip19Utils.encodeNpub(pubkey).slice(0, 8)
  } catch (error) {
    console.error("Error fetching username:", error)
    return nip19Utils.encodeNpub(pubkey).slice(0, 8)
  }
}

async function renderContent(content: string, router: ReturnType<typeof useRouter>, ndk: NDK) {
  const sanitizedContent = sanitizeInput(content)
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const imageRegex = /\.(jpeg|jpg|gif|png|webp)$/i
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g
  const mp3Regex = /\.mp3$/i
  const nostrRegex = /nostr:(?:nevent1|note1|npub1|naddr1|nprofile1)[a-zA-Z0-9]+/g

  const parts = sanitizedContent.split(urlRegex)

  const processedParts = await Promise.all(parts.map(async (part, index) => {
    if (part.match(urlRegex)) {
      if (part.match(imageRegex)) {
        return (
          <img
            key={index}
            src={sanitizeInput(part) || "/placeholder.svg"}
            alt="Content"
            className="w-full h-auto rounded-lg my-2"
          />
        )
      } else if (part.match(youtubeRegex)) {
        const videoId = part.replace(youtubeRegex, "$1")
        return (
          <div key={index} className="w-full aspect-video my-2">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${sanitizeInput(videoId)}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          </div>
        )
      } else if (part.match(mp3Regex)) {
        return (
          <audio key={index} controls className="w-full my-2">
            <source src={sanitizeInput(part)} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )
      } else {
        return (
          <span
            key={index}
            className="text-primary hover:underline cursor-pointer"
            onClick={() => window.open(sanitizeInput(part), "_blank")}
          >
            {sanitizeInput(part)}
          </span>
        )
      }
    } else {
      const matches = part.match(nostrRegex);
      if (!matches) return sanitizeHtml(part);

      // Process all matches and collect the replacements
      const replacements: { match: string; element: JSX.Element; start: number; end: number }[] = [];
      
      for (const match of matches) {
        const entity = match.replace('nostr:', '');
        try {
          const decoded = nip19Utils.decodeAny(entity);
          let displayText = '';
          let onClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            router.push(`/${entity}`);
          };

          switch (decoded.type) {
            case 'nevent':
              displayText = 'Nostr Event';
              break;
            case 'note':
              displayText = 'Nostr Note';
              break;
            case 'npub':
              const username = await getEntityUsername(ndk, decoded.data as string);
              displayText = `@${username}`;
              break;
            case 'naddr':
              const naddrData = decoded.data as { kind: number; pubkey: string; identifier: string };
              displayText = `Article: ${naddrData.identifier || 'Untitled'}`;
              break;
            case 'nprofile':
              const nprofileData = decoded.data as { pubkey: string };
              const profileUsername = await getEntityUsername(ndk, nprofileData.pubkey);
              displayText = `@${profileUsername}`;
              break;
            default:
              continue;
          }

          const element = (
            <span
              key={`${index}-${match}`}
              className="text-primary hover:underline cursor-pointer"
              onClick={onClick}
            >
              {displayText}
            </span>
          );

          const matchIndex = part.indexOf(match);
          replacements.push({
            match,
            element,
            start: matchIndex,
            end: matchIndex + match.length
          });
        } catch (error) {
          console.error('Error processing nostr entity:', error);
        }
      }

      // If no valid replacements, return the original text
      if (replacements.length === 0) return sanitizeHtml(part);

      // Build the final result by combining text and elements
      const result: (string | JSX.Element)[] = [];
      let lastIndex = 0;

      replacements.sort((a, b) => a.start - b.start).forEach((replacement) => {
        if (replacement.start > lastIndex) {
          result.push(sanitizeHtml(part.slice(lastIndex, replacement.start)));
        }
        result.push(replacement.element);
        lastIndex = replacement.end;
      });

      if (lastIndex < part.length) {
        result.push(sanitizeHtml(part.slice(lastIndex)));
      }

      return <>{result}</>;
    }
  }));

  return processedParts;
}

async function getReplyingToUsername(ndk: NDK, pubkey: string): Promise<string> {
  try {
    const user = await ndk.getUser({ pubkey })
    if (!user.profile?.name && !user.profile?.displayName) {
      await user.fetchProfile()
    }
    return user.profile?.name || user.profile?.displayName || nip19Utils.encodeNpub(pubkey).slice(0, 8)
  } catch (error) {
    console.error("Error fetching replying to username:", error)
    return nip19Utils.encodeNpub(pubkey).slice(0, 8)
  }
}

export function NoteView({ note, ndk }: NoteViewProps) {
  const [author, setAuthor] = useState<any>(null)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [renderedContent, setRenderedContent] = useState<React.ReactNode>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const user = await ndk.getUser({ pubkey: note.pubkey })
        await user.fetchProfile()
        setAuthor(user)
      } catch (err) {
        console.error("Error fetching author:", err)
        setError("Failed to load author profile")
        toast({
          title: "Error",
          description: "Failed to load author profile. The note will still be displayed.",
          variant: "destructive",
        })
      }
    }

    fetchAuthor()
  }, [note.pubkey, ndk, toast])

  useEffect(() => {
    const fetchReplyUsername = async () => {
      const replyTag = note.tags.find((tag) => tag[0] === "e" && tag[3] === "mention")
      if (replyTag) {
        const replyingToUsername = await getReplyingToUsername(ndk, replyTag[1])
        setReplyingTo(replyingToUsername)
      }
    }

    fetchReplyUsername()
  }, [note, ndk])

  useEffect(() => {
    const renderNoteContent = async () => {
      if (note.kind === 30023) {
        setRenderedContent(renderLongFormContent(note))
      } else {
        const content = await renderContent(note.content, router, ndk)
        setRenderedContent(content)
      }
    }

    renderNoteContent()
  }, [note, router, ndk])

  const renderLongFormContent = (event: NDKEvent) => {
    const title = event.tags.find(t => t[0] === "title")?.[1]
    const summary = event.tags.find(t => t[0] === "summary")?.[1]
    const image = event.tags.find(t => t[0] === "image")?.[1]

    return (
      <div className="max-w-none">
        <h1 className="text-3xl font-semibold mb-6">{title ? sanitizeInput(title) : "Untitled Article"}</h1>
        {summary && <p className="text-base font-semibold mb-4">{sanitizeInput(summary)}</p>}
        {image && (
          <img
            src={image ? sanitizeInput(image) : "/placeholder.svg"}
            alt={title ? sanitizeInput(title) : "Article image"}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
        )}
        <MarkdownContent 
          content={event.content ? sanitizeInput(event.content) : ""}
          className="text-base space-y-4"
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4" role="article" aria-label="Note details">
      <div className="space-y-4">
        <Button variant="ghost" size="sm" className="rounded-full w-fit dark:text-white" asChild>
          <Link href={`/${nip19Utils.encodeNpub(note.pubkey)}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to profile
          </Link>
        </Button>
        <HorizontalAppLauncher note={note} />
      </div>
      <div className="border rounded-xl overflow-hidden bg-background">
        <div className="p-6">
          {author && (
            <div className="flex items-center justify-between mb-4">
              <Link href={`/${author ? nip19Utils.encodeNpub(author.pubkey) : ""}`} className="flex items-center">
                <div
                  className="w-10 h-10 rounded-full mr-3 bg-cover bg-center"
                  style={{ backgroundImage: `url(${author?.profile?.image || "/placeholder.svg"})` }}
                />
                <div>
                  <h2 className="font-semibold hover:underline dark:text-white dark:hover:text-white">
                    {author?.profile?.name ||
                      author?.profile?.displayName ||
                      (author ? nip19Utils.encodeNpub(author.pubkey).slice(0, 12) + "..." : "Unknown")}
                  </h2>
                  {replyingTo && (
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">Replying to @{replyingTo}</span>
                  )}
                </div>
              </Link>
              <time className="text-sm text-neutral-500 dark:text-neutral-400">
                {note.created_at ? formatTimeAgo(new Date(note.created_at * 1000)) : 'Unknown time'}
              </time>
            </div>
          )}
          {!author && !error && (
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full mr-3 bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
                <div>
                  <div className="h-5 w-32 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-800 rounded mt-1 animate-pulse" />
                </div>
              </div>
              <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
            </div>
          )}
          {error && (
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <img src="/placeholder.svg" alt="Anonymous" className="w-10 h-10 rounded-full mr-3" />
                <div>
                  <h2 className="font-semibold dark:text-white">Anonymous</h2>
                </div>
              </div>
              <time className="text-sm text-gray-500">
                {note.created_at ? formatTimeAgo(new Date(note.created_at * 1000)) : 'Unknown time'}
              </time>
            </div>
          )}
          {note.kind === 6 && (
            <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              <Repeat className="h-4 w-4 mr-1" />
              {nip19Utils.encodeNpub(note.pubkey).slice(0, 8)} Reposted
            </div>
          )}
          <div className="max-w-none dark:text-white" aria-label="Note content">
            {renderedContent}
          </div>
        </div>
      </div>
    </div>
  )
}

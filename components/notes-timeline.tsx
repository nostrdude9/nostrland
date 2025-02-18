"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatTimeAgo } from "@/lib/utils"
import type { NDKEvent, NDKUser } from "@nostr-dev-kit/ndk"
import NDK from "@nostr-dev-kit/ndk"
import { useState, useEffect, Suspense } from "react"
import { Image, Video, FileText, Repeat, Copy } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { LongFormContent } from "./long-form-content"
import Link from "next/link"
import { sanitizeInput, sanitizeHtml } from "@/lib/sanitize"
import * as nip19Utils from "@/lib/nip19"
import { useToast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

function isReply(event: NDKEvent): boolean {
  const hasETag = event.tags.some((tag) => tag[0] === "e")
  console.log(`Event ${event.id} is${hasETag ? "" : " not"} a reply. Tags:`, event.tags)
  return hasETag
}

function getReplyInfo(event: NDKEvent): { parentId: string | null; parentAuthorPubkey: string | null } {
  const eTags = event.tags.filter((tag) => tag[0] === "e")
  const pTags = event.tags.filter((tag) => tag[0] === "p")

  let parentId = null
  let parentAuthorPubkey = null

  if (eTags.length > 0) {
    // The last e tag is the immediate parent
    parentId = eTags[eTags.length - 1][1]
  }

  if (pTags.length > 0) {
    // The first p tag should be the author of the parent note
    parentAuthorPubkey = pTags[0][1]
  }

  console.log(`Reply info for event ${event.id}:`, { parentId, parentAuthorPubkey })
  return { parentId, parentAuthorPubkey }
}

async function getReplyingToInfo(ndk: NDK | null, event: NDKEvent): Promise<{ name: string; npub: string } | null> {
  if (!isReply(event)) {
    return null
  }

  const { parentAuthorPubkey } = getReplyInfo(event)

  if (!parentAuthorPubkey) {
    console.log("No parent author pubkey found for event:", event.id)
    return null
  }

  try {
    console.log("NDK object:", ndk)
    if (!ndk || typeof ndk.getUser !== "function") {
      console.error("NDK object is invalid or getUser method is not available")
      return null
    }

    const user = await ndk.getUser({ pubkey: parentAuthorPubkey })
    if (!user) {
      console.log("User not found for pubkey:", parentAuthorPubkey)
      return null
    }

    await user.fetchProfile()

    const name = user.profile?.name || user.profile?.displayName || nip19Utils.encodeNpub(parentAuthorPubkey).slice(0, 8)
    const npub = nip19Utils.encodeNpub(parentAuthorPubkey)

    console.log("Replying to info fetched successfully:", { name, npub })
    return { name, npub }
  } catch (error) {
    console.error("Error in getReplyingToInfo:", error)
    if (error instanceof Error) {
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }
    return null
  }
}

async function getEntityUsername(ndk: NDK, pubkey: string): Promise<string> {
  if (!ndk) {
    console.error("NDK is not available")
    return nip19Utils.encodeNpub(pubkey).slice(0, 8)
  }
  
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

function NoteContent({ note, router, ndk }: { note: NDKEvent; router: ReturnType<typeof useRouter>; ndk: NDK | null }) {
  const [content, setContent] = useState<React.ReactNode>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const rendered = await renderContent(note.content, router, ndk);
        setContent(rendered);
      } catch (error) {
        console.error("Error rendering content:", error);
        setError("Failed to render content");
        setContent(sanitizeHtml(note.content));
      }
    };
    loadContent();
  }, [note.content, router, ndk]);

  if (error) {
    return <div className="text-destructive">{content}</div>;
  }

  return content;
}

async function renderContent(content: string, router: ReturnType<typeof useRouter>, ndk: NDK | null) {
  if (!ndk) {
    throw new Error("NDK is not available");
  }
  const sanitizedContent = sanitizeInput(content)
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const imageRegex = /\.(jpeg|jpg|gif|png|webp)$/i
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g
  const mp3Regex = /\.mp3$/i

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
            onClick={(e) => {
              e.stopPropagation()
              window.open(sanitizeInput(part), "_blank")
            }}
          >
            {sanitizeInput(part)}
          </span>
        )
      }
    } else {
      const nostrRegex = /nostr:(?:nevent1|note1|npub1|naddr1|nprofile1)[a-zA-Z0-9]+/g;
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
          console.error('Error decoding NIP-19 entity:', error);
          return sanitizeHtml(part);
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

export function NotesTimeline({ notes, user, ndk }: { notes: NDKEvent[]; user: NDKUser; ndk: NDK | null }) {
  const router = useRouter()
  const { toast } = useToast()
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest")
  const [filter, setFilter] = useState<"all" | "images" | "videos" | "articles">("all")
  const [replyingToInfo, setReplyingToInfo] = useState<Map<string, { name: string; npub: string } | null>>(new Map())

  useEffect(() => {
    const fetchReplyingToInfo = async () => {
      const infoMap = new Map()
      for (const note of notes) {
        try {
          console.log("Fetching replying to info for note:", note.id)
          console.log("NDK object in fetchReplyingToInfo:", ndk)
          const info = await getReplyingToInfo(ndk, note)
          infoMap.set(note.id, info)
        } catch (error) {
          console.error("Error fetching replying to info for note:", note.id, error)
        }
      }
      setReplyingToInfo(infoMap)
    }

    if (ndk) {
      fetchReplyingToInfo()
    } else {
      console.error("NDK object is not available")
    }
  }, [notes, ndk])

  const sortedNotes = [...notes].sort((a, b) => {
    const aTime = a.created_at || 0
    const bTime = b.created_at || 0
    return sortOrder === "latest" ? bTime - aTime : aTime - bTime
  })

  const filteredNotes = sortedNotes.filter((note) => {
    if (filter === "all") return true
    if (filter === "images") return note.content.match(/\.(jpeg|jpg|gif|png|webp)$/i)
    if (filter === "videos") return note.content.includes("youtube.com") || note.content.includes("youtu.be")
    if (filter === "articles") return note.kind === 30023
    return true
  })

  return (
    <div className="space-y-6" role="region" aria-label="User notes">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {filter === "all" ? "Notes" : 
           filter === "images" ? "Images" : 
           filter === "videos" ? "Videos" : 
           "Articles"}
        </h2>
        <div className="flex items-center gap-4">
          <Select
            defaultValue={sortOrder}
            onValueChange={(value) => setSortOrder(value as "latest" | "oldest")}
            aria-label="Sort notes"
          >
            <SelectTrigger className="w-[140px] rounded-full bg-white dark:bg-neutral-950">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full bg-white dark:bg-neutral-950"
                aria-label="Filter notes"
              >
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilter("all")}>
                <FileText className="mr-2 h-4 w-4" />
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("images")}>
                <Image className="mr-2 h-4 w-4" />
                Images
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("videos")}>
                <Video className="mr-2 h-4 w-4" />
                Videos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("articles")}>
                <FileText className="mr-2 h-4 w-4" />
                Articles
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="space-y-4">
        {filteredNotes.map((note) => (
          <div key={note.id}>
            {note.kind === 30023 ? (
              <LongFormContent event={note} />
            ) : (
              <div className="cursor-pointer" onClick={() => router.push(`/${note.id}`)}>
                <Card className="rounded-xl overflow-hidden bg-background">
                  <CardContent className="p-4">
                    {isReply(note) && replyingToInfo.get(note.id) && (
                      <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                        Replying to{" "}
                        <Link
                          href={`/${replyingToInfo.get(note.id)?.npub}`}
                          className="text-blue-500 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          @{replyingToInfo.get(note.id)?.name}
                        </Link>
                      </div>
                    )}
                    {note.kind === 6 && (
                      <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                        <Repeat className="h-4 w-4 mr-1" />
                        {nip19Utils.encodeNpub(note.pubkey).slice(0, 8)} Reposted
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div
                          className="h-8 w-8 rounded-full mr-2 bg-cover bg-center"
                          style={{ backgroundImage: `url(${user.profile?.image || "/placeholder.svg"})` }}
                        />
                        <span className="font-medium dark:text-white">
                          {user.profile?.name || user.profile?.displayName || user.npub}
                        </span>
                      </div>
                      <time className="text-sm text-neutral-500 dark:text-neutral-400">
                        {formatTimeAgo(new Date((note.created_at || 0) * 1000))}
                      </time>
                    </div>
                    <div className="prose prose-sm max-w-none dark:text-white">
                      <NoteContent note={note} router={router} ndk={ndk} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

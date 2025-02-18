import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare, Heart, Repeat, Share2, Filter } from "lucide-react"

const notes = [
  {
    id: "1",
    content: "Today I built tools for Jenny, an AI agent, to use any MCP server hosted by anyone over the internet...",
    timestamp: new Date(),
    replies: 3,
    likes: 12,
    reposts: 5,
  },
  // Add more notes as needed
]

export function NotesFeed() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Select defaultValue="latest">
          <SelectTrigger className="w-[200px] rounded-full border border-neutral-200 bg-neutral-200 dark:border-neutral-800 dark:bg-black dark:text-white">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="rounded-xl bg-white dark:bg-black dark:text-white">
            <SelectItem value="latest">Latest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="popular">Most popular</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full border border-neutral-200 bg-neutral-200 dark:border-neutral-800 dark:bg-black dark:text-white"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <Input
        placeholder="Write a note..."
        className="rounded-full border border-neutral-200 bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-800 dark:text-white"
      />

      {notes.map((note) => (
        <Card key={note.id} className="border border-neutral-200 rounded-xl bg-white">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-neutral-600">{note.content}</p>
                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <time>{formatDistanceToNow(note.timestamp, { addSuffix: true })}</time>
                    <span>·</span>
                    <Badge variant="secondary" className="text-neutral-600 rounded-full">
                      Public
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <Button variant="ghost" size="sm" className="text-neutral-600 hover:bg-neutral-50 rounded-full">
                  <MessageSquare className="mr-1.5 h-4 w-4" />
                  {note.replies}
                </Button>
                <Button variant="ghost" size="sm" className="text-neutral-600 hover:bg-neutral-50 rounded-full">
                  <Heart className="mr-1.5 h-4 w-4" />
                  {note.likes}
                </Button>
                <Button variant="ghost" size="sm" className="text-neutral-600 hover:bg-neutral-50 rounded-full">
                  <Repeat className="mr-1.5 h-4 w-4" />
                  {note.reposts}
                </Button>
                <Button variant="ghost" size="sm" className="text-neutral-600 hover:bg-neutral-50 rounded-full">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SearchCard() {
  const [input, setInput] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      // Check if the input is a note ID (starts with 'note1')
      if (input.startsWith("note1")) {
        router.push(`/${input.trim()}`)
      }
      // Check if the input is an event ID (starts with 'nevent1')
      else if (input.startsWith("nevent1")) {
        router.push(`/${input.trim()}`)
      }
      // Otherwise, treat it as a public key (npub)
      else {
        router.push(`/${input.trim()}`)
      }
    }
  }

  return (
    <Card className="w-full rounded-3xl">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            type="text"
            placeholder="Search public key, note or event"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="rounded-full pt-1.5 pb-2"
          />
          <Button type="submit" className="w-full rounded-full">
            Search
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}


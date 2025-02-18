"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function HomeView() {
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
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md rounded-3xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex flex-col gap-2">
                <Input
                  type="text"
                  placeholder="Public key, note or event"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="rounded-full pt-1.5 pb-2"
                />
                <Button type="submit" className="rounded-full dark:text-white">
                  Go
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

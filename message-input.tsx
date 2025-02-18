"use client"

import { Input } from "@/components/ui/input"
import { AtSign, ChevronRight, Slash } from "lucide-react"

export default function MessageInput() {
  return (
    <div className="relative max-w-2xl mx-auto p-6">
      <div className="relative">
        <Input
          type="text"
          placeholder="Type a message..."
          className="w-full h-[300px] pl-16 pr-12 rounded-[24px] bg-gray-50 border-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 text-base"
        />
        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-400">
          <Slash className="h-4 w-4" />
          <AtSign className="h-4 w-4" />
        </div>
        <button
          className="absolute right-6 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Send message"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}


"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"
import { useState } from "react"
import { OnboardingFlow } from "./onboarding-flow"

export function GlobalNavbar() {
  const [showOnboarding, setShowOnboarding] = useState(false)

  const handleOpenOnboarding = () => {
    setShowOnboarding(true)
  }

  const handleCloseOnboarding = () => {
    setShowOnboarding(false)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-12 bg-background border-b z-50" aria-label="Main navigation">
        <div className="container h-full max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center" aria-label="Home">
            <div className="h-8 aspect-square rounded-full bg-gray-200 dark:bg-neutral-900 flex items-center justify-center">
              <span className="text-lg font-semibold">N</span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle aria-label="Toggle theme" />
            <Button
              size="sm"
              className="rounded-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleOpenOnboarding}
              aria-label="Join Nostr"
            >
              Join Nostr
            </Button>
          </div>
        </div>
      </header>
      {showOnboarding && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <OnboardingFlow onClose={handleCloseOnboarding} />
        </div>
      )}
    </>
  )
}

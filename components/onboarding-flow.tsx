"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Copy, Download, ChevronDown, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { generateSecretKey, getPublicKey, nip19 } from "nostr-tools"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import NDK, { NDKEvent, NDKPrivateKeySigner } from "@nostr-dev-kit/ndk"
import { CONFIG } from "@/lib/config"
import { sanitizeInput } from "@/lib/sanitize"

const slides = [
  {
    title: "Protocols over apps",
    text: "Nostr is accessible via many apps. You choose which one, or use them all.",
    buttonText: "Next",
  },
  {
    title: "An identity you truly own",
    text: 'No accounts, no emails, no kingmakers. Just keys. "Sign" messages with your keys to prove its you.',
    buttonText: "Let's go!",
  },
]

const relays = CONFIG.relays

interface OnboardingFlowProps {
  onClose: () => void
}

export function OnboardingFlow({ onClose }: OnboardingFlowProps) {
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    bio: "",
  })
  const [privateKey, setPrivateKey] = useState<Uint8Array | null>(null)
  const [showNsec, setShowNsec] = useState(false)
  const [understood, setUnderstood] = useState(false)
  const { toast } = useToast()

  // Generate keys on mount
  useEffect(() => {
    const newPrivateKey = generateSecretKey()
    setPrivateKey(newPrivateKey)
  }, [])

  const handleNext = () => {
    if (step < slides.length + 1) {
      setStep(step + 1)
    }
  }

  const handleSave = async () => {
    if (!privateKey) {
      toast({
        title: "Error",
        description: "Something went wrong with key generation. Please try again.",
        variant: "destructive",
      })
      return
    }

    try {
      const ndk = new NDK({ 
        explicitRelayUrls: [
          "wss://relay.damus.io",
          "wss://relay.nostr.band",
          "wss://nos.lol",
          "wss://nostr-pub.wellorder.net"
        ] 
      })

      try {
        const connectPromise = ndk.connect()
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Connection timeout")), 10000),
        )
        await Promise.race([connectPromise, timeoutPromise])

        if (!ndk.pool || !ndk.pool.relays.size) {
          console.error("No relays connected.")
          throw new Error("Failed to connect to relays. Please try again.")
        }

        await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch (error) {
        console.error("NDK connection error:", error)
        throw new Error("Failed to connect to relays. Please try again.")
      }

      const signer = new NDKPrivateKeySigner(privateKey)
      await signer.blockUntilReady()
      ndk.signer = signer

      const pubkey = getPublicKey(privateKey)

      const event = new NDKEvent(ndk)
      event.kind = 0
      event.pubkey = pubkey
      event.content = JSON.stringify({
        name: sanitizeInput(profile.name),
        username: sanitizeInput(profile.username),
        about: sanitizeInput(profile.bio),
      })
      event.tags = []

      await event.sign(signer)

      let published = false
      let attempts = 0
      const maxAttempts = 3
      const publishTimeout = 8000 // Increased timeout for multiple relays

      while (!published && attempts < maxAttempts) {
        try {
          const publishPromise = event.publish()
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Publish timeout")), publishTimeout)
          )
          
          const result = await Promise.race([publishPromise, timeoutPromise])
          if (!result) {
            throw new Error("No confirmation from relays")
          }
          
          console.log("Publish result:", result)
          published = true

          toast({
            title: "Profile Created",
            description: "Your profile has been created and published to relays. You can now view your keys.",
          })

          handleNext()
        } catch (error) {
          console.error(`Publish attempt ${attempts + 1} failed:`, error)
          attempts++
          
          if (attempts === maxAttempts) {
            throw new Error(
              "Failed to publish profile after multiple attempts. Please check your connection and try again."
            )
          }
          
          // Exponential backoff between attempts
          await new Promise((resolve) => setTimeout(resolve, Math.min(1000 * Math.pow(2, attempts), 5000)))
        }
      }
    } catch (error) {
      console.error("Error publishing event:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to publish profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCopy = () => {
    if (privateKey) {
      const nsec = nip19.nsecEncode(privateKey)
      navigator.clipboard.writeText(nsec)
      toast({
        title: "Copied!",
        description: "Your private key has been copied to clipboard.",
      })
    }
  }

  const handleDownload = () => {
    if (privateKey) {
      const nsec = nip19.nsecEncode(privateKey)
      const npub = nip19.npubEncode(getPublicKey(privateKey))
      const content = `NSEC (Private Key): ${nsec}\nNPUB (Public Key): ${npub}\n\nKeep your NSEC private and secure!\n\nHow this works:\n\n1. Your NSEC (private key) acts as your password, but you cannot reset it. Safeguard this key at all times and try not to plug it into any random app.\n2. If you wish to use nostr in browser, try Primal.net or Jumble.social.\n3. You can also use a browser extension to help safeguard your NSEC. The extension stores your key locally on your device and websites ping it to sign events. This is a safer way to use nostr on the web. Nostr Connect in Chrome and Firefox are good extensions: https://chromewebstore.google.com/detail/nostr-connect/ampjiinddmggbhpebhaegmjkbbeofoaj\n\nNostr Tips:\n1. Follow many people. Nostr doesn't have built-in default algorithms. The more people you follow, the better your experience will be.\n2. Try different apps. Since nostr is a protocol, you can use many different apps to access it. If one feels clucky or doesn't fit your needs, try another app. The best apps on android are: Amethyst, Primal. On iOS we recommend Primal or Damus.\n3. Save your nsec in a password manager. Bitwarden is a good password manager, but feel free to use your own. Saving your nsec helps prevent situations where you may lose your key. https://bitwarden.com/`
      const element = document.createElement("a")
      const file = new Blob([content], { type: "text/plain" })
      element.href = URL.createObjectURL(file)
      element.download = "nostr-keys.txt"
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }
  }

  const clientOptions = CONFIG.clientOptions

  const handleClientClick = (client: { name: string; getUrl: (npub: string) => string }) => {
    if (privateKey) {
      const npub = nip19.npubEncode(getPublicKey(privateKey))
      const url = client.getUrl(npub)
      window.open(url, "_blank")
    }
  }

  const slideVariants = {
    enter: { x: "100%", opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50 px-4">
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-background/80 backdrop-blur-sm"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "tween", ease: "anticipate", duration: 0.5 }}
        >
          {step < 2 && (
            <Card className="w-full max-w-md rounded-3xl mx-auto">
              <CardContent className="p-6 space-y-4">
                <img 
                  src={step === 0 ? "/high-five.png" : "/relaxing.png"} 
                  alt={step === 0 ? "Protocols over apps illustration" : "Identity ownership illustration"} 
                  className="w-full h-auto object-cover mb-6" 
                />
                <h2 className="text-2xl font-bold text-center">{slides[step].title}</h2>
                <p className="text-center text-muted-foreground">{slides[step].text}</p>
                <Button className="w-full rounded-full" onClick={handleNext}>
                  {slides[step].buttonText}
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="w-full max-w-3xl rounded-3xl mx-auto">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-2xl font-bold">Your basic profile</h2>
                <p className="text-muted-foreground">You can upload an image later in your favorite nostr app.</p>
                <div className="space-y-2">
                  <Input
                    placeholder="Name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: sanitizeInput(e.target.value) })}
                    className="rounded-full"
                  />
                  <p className="text-xs text-muted-foreground">Nostr is nym-friendly, you don't need to use your real name.</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="mr-2">@</span>
                    <Input
                      placeholder="Username"
                      value={profile.username}
                      onChange={(e) => setProfile({ ...profile, username: sanitizeInput(e.target.value) })}
                      className="rounded-full"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Usernames are not unique in nostr. Two people can have the same username.</p>
                </div>
                <Textarea
                  placeholder="Short bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: sanitizeInput(e.target.value) })}
                  className="rounded-xl"
                />
                <Button className="w-full rounded-full" onClick={handleSave}>
                  Save
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 3 && privateKey && (
            <Card className="w-full max-w-md rounded-3xl mx-auto">
              <CardContent className="p-6 space-y-4">
                <img src="/done.png" alt="Setup complete illustration" className="w-full h-auto object-cover mb-6" />
                <h2 className="text-2xl font-bold text-center">Your Nostr Keys</h2>
                <p className="text-center text-muted-foreground">
                  Keep your nsec (private key) secret. It's like a password that can't be changed.
                </p>
                <div className="space-y-2">
                  <Label>Public Key (npub)</Label>
                  <Input value={nip19.npubEncode(getPublicKey(privateKey))} readOnly className="rounded-full" />
                </div>
                <div className="space-y-2">
                  <Label>Private Key (nsec)</Label>
                  <div className="relative">
                    <Input
                      type={showNsec ? "text" : "password"}
                      value={nip19.nsecEncode(privateKey)}
                      readOnly
                      className="rounded-full"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 rounded-full"
                      onClick={() => setShowNsec(!showNsec)}
                    >
                      {showNsec ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleCopy} className="flex-1 rounded-full" variant="secondary">
                    <Copy className="mr-2 h-4 w-4" /> Copy
                  </Button>
                  <Button onClick={handleDownload} className="flex-1 rounded-full" variant="secondary">
                    <Download className="mr-2 h-4 w-4" /> Download
                  </Button>
                </div>
                <div className="flex items-center space-x-4">
                  <Checkbox 
                    id="understood" 
                    checked={understood} 
                    onCheckedChange={(checked) => setUnderstood(checked === true)}
                    className="rounded-sm"
                  />
                  <label
                    htmlFor="understood"
                    className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I understand that I should not share my nsec and that if it leaks, everyone will have access to my
                    account forever.
                  </label>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-full rounded-full" disabled={!understood}>
                      See my profile in <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    {clientOptions.map((client) => (
                      <DropdownMenuItem key={client.name} onClick={() => handleClientClick(client)}>
                        {client.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

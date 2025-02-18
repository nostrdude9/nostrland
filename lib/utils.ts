import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface OpenGraphData {
  title?: string
  description?: string
  image?: string
  url?: string
}

export function formatTimeAgo(date: Date | number): string {
  const distance = formatDistanceToNow(date, { addSuffix: true })
  
  // Remove "about" and "almost" prefixes
  let formatted = distance.replace(/(about|almost)\s/g, '')
  
  // Convert time units to short form
  formatted = formatted
    .replace(/(\d+)\s*minutes?\sago/, '$1min')
    .replace(/(\d+)\s*hours?\sago/, '$1h')
    .replace(/(\d+)\s*days?\sago/, '$1d')
    .replace(/(\d+)\s*months?\sago/, '$1mo')
    .replace(/(\d+)\s*years?\sago/, '$1y')
    .replace(/less than a minute ago/, '1min')
    .replace(/about a minute ago/, '1min')
    .replace(/about an hour ago/, '1h')
    .replace(/(\d+)\s*seconds?\sago/, '1min')
  
  return formatted
}

export async function fetchOpenGraphData(url: string): Promise<OpenGraphData | null> {
  try {
    const response = await fetch(`/api/og?url=${encodeURIComponent(url)}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    if (!data || typeof data !== "object") {
      throw new Error("Invalid data received from API")
    }
    return data
  } catch (error) {
    console.error("Error fetching Open Graph data:", error)
    return null
  }
}

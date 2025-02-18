import { NextResponse } from "next/server"
import ogs from "open-graph-scraper"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 })
  }

  try {
    const { result, error } = await ogs({ url })

    if (error) {
      console.error("OGS error:", error)
      return NextResponse.json({ error: "Failed to fetch Open Graph data" }, { status: 500 })
    }

    return NextResponse.json({
      title: result.ogTitle,
      description: result.ogDescription,
      image: result.ogImage?.[0]?.url,
      url: result.ogUrl || url,
    })
  } catch (error) {
    console.error("Error fetching Open Graph data:", error)
    return NextResponse.json({ error: "Failed to fetch Open Graph data" }, { status: 500 })
  }
}


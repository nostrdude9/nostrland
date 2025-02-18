import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { npub: string } }) {
  const user = await db.getUser(params.npub)
  if (user) {
    return NextResponse.json(user)
  } else {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }
}

export async function POST(request: Request, { params }: { params: { npub: string } }) {
  const body = await request.json()
  const user = await db.createUser({ ...body, npub: params.npub })
  return NextResponse.json(user)
}


import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { npub: string } }) {
  const notes = await db.getNotes(params.npub)
  return NextResponse.json(notes)
}

export async function POST(request: Request, { params }: { params: { npub: string } }) {
  const body = await request.json()
  const note = await db.createNote({ ...body, userNpub: params.npub })
  return NextResponse.json(note)
}


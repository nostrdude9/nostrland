import { nip19 } from 'nostr-tools'

// Basic entity encoders/decoders
export function encodeNpub(pubkey: string): string {
  return nip19.npubEncode(pubkey)
}

export function decodeNpub(npub: string): string {
  try {
    const { type, data } = nip19.decode(npub)
    if (type !== 'npub') throw new Error('Not an npub')
    return data as string
  } catch (error) {
    console.error('Error decoding npub:', error)
    throw error
  }
}

export function encodeNote(noteId: string): string {
  return nip19.noteEncode(noteId)
}

export function decodeNote(note: string): string {
  try {
    const { type, data } = nip19.decode(note)
    if (type !== 'note') throw new Error('Not a note')
    return data as string
  } catch (error) {
    console.error('Error decoding note:', error)
    throw error
  }
}

// Complex entity encoders/decoders
interface NaddrData {
  kind: number
  pubkey: string
  identifier: string
  relays?: string[]
}

export function encodeNaddr({ kind, pubkey, identifier, relays = [] }: NaddrData): string {
  return nip19.naddrEncode({
    kind,
    pubkey,
    identifier: identifier || '',
    relays
  })
}

export function decodeNaddr(naddr: string): NaddrData {
  try {
    const { type, data } = nip19.decode(naddr)
    if (type !== 'naddr') throw new Error('Not an naddr')
    return data as NaddrData
  } catch (error) {
    console.error('Error decoding naddr:', error)
    throw error
  }
}

interface NeventData {
  id: string
  relays?: string[]
  author?: string
  kind?: number
}

export function encodeNevent({ id, relays = [], author, kind }: NeventData): string {
  return nip19.neventEncode({
    id,
    relays,
    author,
    kind
  })
}

export function decodeNevent(nevent: string): NeventData {
  try {
    const { type, data } = nip19.decode(nevent)
    if (type !== 'nevent') throw new Error('Not an nevent')
    return data as NeventData
  } catch (error) {
    console.error('Error decoding nevent:', error)
    throw error
  }
}

interface NprofileData {
  pubkey: string
  relays?: string[]
}

export function encodeNprofile({ pubkey, relays = [] }: NprofileData): string {
  return nip19.nprofileEncode({
    pubkey,
    relays
  })
}

export function decodeNprofile(nprofile: string): NprofileData {
  try {
    const { type, data } = nip19.decode(nprofile)
    if (type !== 'nprofile') throw new Error('Not a nprofile')
    return data as NprofileData
  } catch (error) {
    console.error('Error decoding nprofile:', error)
    throw error
  }
}

// Generic decoder that handles any NIP-19 entity
export function decodeAny(encoded: string): { type: string; data: any } {
  try {
    return nip19.decode(encoded)
  } catch (error) {
    console.error('Error decoding NIP-19 entity:', error)
    throw error
  }
}

// Helper to check if a string is a valid NIP-19 entity
export function isValidNip19(encoded: string): boolean {
  try {
    nip19.decode(encoded)
    return true
  } catch {
    return false
  }
}

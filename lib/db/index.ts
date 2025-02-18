import type { NDKUser } from "@nostr-dev-kit/ndk"

interface User {
  npub: string
  name?: string
  displayName?: string
  about?: string
  picture?: string
  nip05?: string
  lud06?: string
  lud16?: string
}

interface Note {
  id: string
  userNpub: string
  content: string
  createdAt: number
}

class InMemoryDB {
  private users: User[] = []
  private notes: Note[] = []

  async getUser(npub: string): Promise<User | undefined> {
    return this.users.find((user) => user.npub === npub)
  }

  async createUser(user: User): Promise<User> {
    this.users.push(user)
    return user
  }

  async getNotes(userNpub: string): Promise<Note[]> {
    return this.notes.filter((note) => note.userNpub === userNpub)
  }

  async createNote(note: Note): Promise<Note> {
    this.notes.push(note)
    return note
  }
}

export const db = new InMemoryDB()

export function convertNDKUserToUser(ndkUser: NDKUser): User {
  return {
    npub: ndkUser.npub,
    name: ndkUser.profile?.name,
    displayName: ndkUser.profile?.displayName,
    about: ndkUser.profile?.about,
    picture: ndkUser.profile?.image,
    nip05: ndkUser.profile?.nip05,
    lud06: ndkUser.profile?.lud06,
    lud16: ndkUser.profile?.lud16,
  }
}


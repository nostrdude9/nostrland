import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  npub: text("npub").notNull().unique(),
  name: text("name"),
  displayName: text("display_name"),
  about: text("about"),
  picture: text("picture"),
  nip05: text("nip05"),
  lud06: text("lud06"),
  lud16: text("lud16"),
})

export const notes = sqliteTable("notes", {
  id: integer("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  content: text("content").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
})


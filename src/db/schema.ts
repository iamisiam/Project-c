import { sqliteTable, text, integer, blob } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const couples = sqliteTable("couples", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  user1Id: integer("user1_id").notNull().references(() => users.id),
  user2Id: integer("user2_id").notNull().references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const quizzes = sqliteTable("quizzes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  coupleId: integer("couple_id").notNull().references(() => couples.id),
  topic: text("topic").notNull(),
  user1Answers: text("user1_answers", { mode: "json" }), // JSON array of answers
  user2Answers: text("user2_answers", { mode: "json" }),
  user1Guesses: text("user1_guesses", { mode: "json" }), // Guesses for partner's answers
  user2Guesses: text("user2_guesses", { mode: "json" }),
  scores: text("scores", { mode: "json" }), // { user1: score, user2: score }
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const albums = sqliteTable("albums", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  coupleId: integer("couple_id").notNull().references(() => couples.id),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const photos = sqliteTable("photos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  albumId: integer("album_id").notNull().references(() => albums.id),
  url: text("url").notNull(),
  caption: text("caption"),
  uploadedAt: integer("uploaded_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const frustrations = sqliteTable("frustrations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  shared: integer("shared", { mode: "boolean" }).default(false),
  escalated: integer("escalated", { mode: "boolean" }).default(false),
  comments: text("comments", { mode: "json" }).default("[]"), // Array of {userId, comment, timestamp}
  aiAdvice: text("ai_advice"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const calendarEvents = sqliteTable("calendar_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  coupleId: integer("couple_id").notNull().references(() => couples.id),
  date: integer("date", { mode: "timestamp" }).notNull(),
  title: text("title").notNull(),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const usisms = sqliteTable("usisms", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  coupleId: integer("couple_id").notNull().references(() => couples.id),
  word: text("word").notNull(),
  definition: text("definition").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
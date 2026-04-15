CREATE TABLE `albums` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`couple_id` integer NOT NULL,
	`name` text NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`couple_id`) REFERENCES `couples`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `calendar_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`couple_id` integer NOT NULL,
	`date` integer NOT NULL,
	`title` text NOT NULL,
	`notes` text,
	`created_at` integer,
	FOREIGN KEY (`couple_id`) REFERENCES `couples`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `couples` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user1_id` integer NOT NULL,
	`user2_id` integer NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`user1_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user2_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `frustrations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`content` text NOT NULL,
	`shared` integer DEFAULT false,
	`escalated` integer DEFAULT false,
	`comments` text DEFAULT '[]',
	`ai_advice` text,
	`created_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `photos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`album_id` integer NOT NULL,
	`url` text NOT NULL,
	`caption` text,
	`uploaded_at` integer,
	FOREIGN KEY (`album_id`) REFERENCES `albums`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `quizzes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`couple_id` integer NOT NULL,
	`topic` text NOT NULL,
	`user1_answers` text,
	`user2_answers` text,
	`user1_guesses` text,
	`user2_guesses` text,
	`scores` text,
	`created_at` integer,
	FOREIGN KEY (`couple_id`) REFERENCES `couples`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `usisms` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`couple_id` integer NOT NULL,
	`word` text NOT NULL,
	`definition` text NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`couple_id`) REFERENCES `couples`(`id`) ON UPDATE no action ON DELETE no action
);

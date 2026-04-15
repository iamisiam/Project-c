PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_couples` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user1_id` integer,
	`user2_id` integer,
	`invitation_code` text NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`user1_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user2_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_couples`("id", "user1_id", "user2_id", "invitation_code", "created_at") SELECT "id", "user1_id", "user2_id", "invitation_code", "created_at" FROM `couples`;--> statement-breakpoint
DROP TABLE `couples`;--> statement-breakpoint
ALTER TABLE `__new_couples` RENAME TO `couples`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `couples_invitation_code_unique` ON `couples` (`invitation_code`);
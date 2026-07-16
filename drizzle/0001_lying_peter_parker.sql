CREATE TABLE `marketing_subscribers` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`first_name` text NOT NULL,
	`status` text DEFAULT 'subscribed' NOT NULL,
	`source` text DEFAULT 'private-list' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `marketing_subscribers_email_unique` ON `marketing_subscribers` (`email`);
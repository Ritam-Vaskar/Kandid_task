CREATE TABLE `activities` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`description` text NOT NULL,
	`lead_id` text NOT NULL,
	`campaign_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `campaigns` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`status` text DEFAULT 'draft',
	`description` text,
	`total_leads` integer DEFAULT 0,
	`request_sent` integer DEFAULT 0,
	`request_accepted` integer DEFAULT 0,
	`request_replied` integer DEFAULT 0,
	`conversion_rate` real DEFAULT 0,
	`start_date` integer,
	`end_date` integer,
	`user_id` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`title` text,
	`company` text,
	`linkedin_url` text,
	`profile_image` text,
	`status` text DEFAULT 'pending',
	`campaign_id` text NOT NULL,
	`last_contact_date` integer,
	`notes` text,
	`activity_data` text,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `linkedin_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`profile_image` text,
	`status` text DEFAULT 'pending',
	`requests_used` integer DEFAULT 0,
	`requests_limit` integer DEFAULT 30,
	`user_id` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`image` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
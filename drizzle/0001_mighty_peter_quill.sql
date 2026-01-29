CREATE TABLE `generations` (
	`id` varchar(64) NOT NULL,
	`userId` int NOT NULL,
	`originalImage` varchar(512),
	`resultImage` varchar(512) NOT NULL,
	`prompt` text,
	`title` text,
	`subtitle` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `generations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `credits` int DEFAULT 5 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `isVip` int DEFAULT 0 NOT NULL;
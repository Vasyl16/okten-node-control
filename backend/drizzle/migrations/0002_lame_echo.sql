ALTER TABLE "advertisements" ADD COLUMN "status" varchar(20) DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "advertisements" ADD COLUMN "edit_attempts" integer DEFAULT 0 NOT NULL;
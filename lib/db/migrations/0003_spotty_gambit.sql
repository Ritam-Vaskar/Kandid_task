CREATE TABLE "linkedin_account" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"expires_at" timestamp,
	"profile_url" text,
	"profile_image" text,
	"requests_used" integer DEFAULT 0 NOT NULL,
	"requests_limit" integer DEFAULT 100 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "campaign" ALTER COLUMN "conversion_rate" SET DATA TYPE numeric(5, 2);--> statement-breakpoint
ALTER TABLE "campaign" ALTER COLUMN "conversion_rate" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "linkedin_account" ADD CONSTRAINT "linkedin_account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
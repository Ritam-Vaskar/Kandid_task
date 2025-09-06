ALTER TABLE "linkedin_account"
ADD COLUMN "name" text NOT NULL,
ADD COLUMN "status" text NOT NULL DEFAULT 'active',
ADD COLUMN "profile_image" text,
ADD COLUMN "requests_used" integer NOT NULL DEFAULT 0,
ADD COLUMN "requests_limit" integer NOT NULL DEFAULT 100;

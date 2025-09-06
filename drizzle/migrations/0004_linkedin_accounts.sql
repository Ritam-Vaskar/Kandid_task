CREATE TABLE IF NOT EXISTS "linkedin_account" (
    "id" text PRIMARY KEY,
    "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "email" text NOT NULL,
    "access_token" text,
    "refresh_token" text,
    "expires_at" timestamp,
    "profile_url" text,
    "createdAt" timestamp NOT NULL DEFAULT now(),
    "updatedAt" timestamp NOT NULL DEFAULT now()
);

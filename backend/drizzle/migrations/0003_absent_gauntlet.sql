CREATE TABLE "currency_rates" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider" varchar(50) DEFAULT 'privatbank' NOT NULL,
	"usd_to_uah" numeric(12, 4) NOT NULL,
	"eur_to_uah" numeric(12, 4) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

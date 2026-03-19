CREATE TABLE "brand_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"requested_name" varchar(100) NOT NULL,
	"comment" text,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "model_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"requested_name" varchar(100) NOT NULL,
	"comment" text,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"brand_id" integer NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_banned" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "brand_requests" ADD CONSTRAINT "brand_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_requests" ADD CONSTRAINT "model_requests_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_requests" ADD CONSTRAINT "model_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
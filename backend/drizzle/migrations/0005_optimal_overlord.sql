CREATE TABLE "advert_view_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"advert_id" integer NOT NULL,
	"day" timestamp with time zone NOT NULL,
	"views" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "advert_view_stats" ADD CONSTRAINT "advert_view_stats_advert_id_advertisements_id_fk" FOREIGN KEY ("advert_id") REFERENCES "public"."advertisements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "advert_view_stats_advert_day_idx" ON "advert_view_stats" USING btree ("advert_id","day");
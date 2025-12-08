ALTER TABLE "messages" DROP CONSTRAINT "messages_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "sender_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
CREATE TABLE "blacklist_tokens" (
	"jti" text PRIMARY KEY NOT NULL,
	"expired_at" timestamp with time zone NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid NOT NULL,
	"content" varchar(2000),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "participants" (
	"conversation_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "participants_conversation_id_user_id_pk" PRIMARY KEY("conversation_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"last_seen" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "usernameLength" CHECK (LENGTH("users"."username") >= 3)
);
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_id_conversations_id_fk" FOREIGN KEY ("id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "updated_at_idx" ON "conversations" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "conversation_message_idx" ON "messages" USING btree ("id","created_at");--> statement-breakpoint
CREATE INDEX "user_id_idx" ON "participants" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "conversation_id_idx" ON "participants" USING btree ("conversation_id");--> statement-breakpoint
CREATE UNIQUE INDEX "email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "username_idx" ON "users" USING btree ("username");
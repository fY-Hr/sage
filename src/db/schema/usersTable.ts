import { sql } from 'drizzle-orm';
import { 
    pgTable,
    uuid,
    check,
    varchar,
    timestamp
} from 'drizzle-orm/pg-core';

export const usersTable = pgTable(
    'users', 
    {
        id: uuid('id').primaryKey().defaultRandom(),
        username: varchar('username', { length: 255 }).notNull(),
        email: varchar('email', { length: 255 }).notNull().unique(),
        password_hash: varchar('password_hash', { length: 255 }).notNull(),
        last_seen: timestamp('last_seen').defaultNow().notNull(),
        created_at: timestamp('created_at').defaultNow().notNull(),
        updated_at: timestamp('created_at').defaultNow().notNull(),
    },

    (table) => [
        check("usernameLength", sql`LENGTH(${table.username}) >= 3`),
    ]
)


import {
    pgTable,
    uuid,
    varchar,
    index
} from 'drizzle-orm/pg-core';
import { conversationsTable } from './conversationsTable';
import { usersTable } from './usersTable';
import { timestamp } from 'drizzle-orm/pg-core';

export const messagesTable = pgTable(
    'messages',
    {
        id: uuid('id').primaryKey().defaultRandom().notNull(),
        conversation_id: uuid('id').notNull().references(() => conversationsTable.id, { onDelete: 'cascade'}),
        sender_id: uuid('id').notNull().references(() => usersTable.id, { onDelete: 'set null'}),
        content: varchar('content', {length: 2000}),
        created_at: timestamp('created_at').defaultNow().notNull(),
        updated_at: timestamp('updated_at').defaultNow().notNull()
    },
    (table) => ({
        // We are doing a compound indexing, combining 
        converMessageIdx: index('conversation_message_idx').on(table.conversation_id, table.created_at)
        // We are doing this so the message retreival can be sorted automaticly without adding more logic
    })
)
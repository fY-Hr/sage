import {
    pgTable,
    uuid,
    boolean,
    primaryKey,
    timestamp,
    index
} from 'drizzle-orm/pg-core';
import { usersTable } from './usersTable';
import { conversationsTable } from './conversationsTable';

export const participantsTable = pgTable(
    'participants',
    {
        conversation_id: uuid('conversation_id').notNull().references(() => conversationsTable.id),
        user_id: uuid('user_id').notNull().references(() => usersTable.id),
        deleted_since: timestamp('deleted_since'), // For soft delete feature
        is_visible: boolean('is_visible').default(false),
        created_at: timestamp('created_at').defaultNow().notNull(),
        updated_at: timestamp('updated_at').defaultNow().notNull()
    },
    (table) => ({
        pk: primaryKey({columns: [table.conversation_id, table.user_id]}),
        userIdx: index('user_id_idx').on(table.user_id),
        converIdx: index('conversation_id_idx').on(table.conversation_id)
    })
)
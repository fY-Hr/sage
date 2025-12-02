import {
    pgTable,
    uuid,
    timestamp,
    index
} from 'drizzle-orm/pg-core';

export const conversationsTable = pgTable(
    'conversations',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        created_at: timestamp('created_at').defaultNow().notNull(),
        updated_at: timestamp('updated_at').defaultNow().notNull()
    },
    (table) => ({
        updatedAtIdx: index('updated_at_idx').on(table.updated_at)
        
    })
)
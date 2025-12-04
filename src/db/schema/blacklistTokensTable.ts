import { 
    pgTable ,
    text,
    timestamp
} from 'drizzle-orm/pg-core';


export const blacklistTokensTable = pgTable(
    'blacklist_tokens',
    {
        jti: text('jti').primaryKey(),
        expired_at: timestamp('expired_at', {withTimezone: true, mode: 'date'}).notNull(),
        created_at: timestamp('created_at').defaultNow().notNull(),
    }
)
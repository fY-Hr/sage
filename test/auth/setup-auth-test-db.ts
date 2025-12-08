import { randomUUIDv7 } from "bun";
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from "../../src/schemas/auth"; 
import { migrate } from 'drizzle-orm/node-postgres/migrator';

const adminDbUrl = process.env.ADMIN_DB_URL;

export type TestDbContext = {
    pool: Pool,
    db: NodePgDatabase<typeof schema>,
    testDbName: string
}

export async function createTestDb(): Promise<TestDbContext>{
    const testDbName = `test_db_${randomUUIDv7().replace(/-/g, '')}`;
    const testDbUrl = `postgres://user:password@localhost:5432/${testDbName}`;

    const adminPool = new Pool({
        connectionString: adminDbUrl
    })

    await adminPool.query(`CREATE DATABASE ${testDbName}`);
    await adminPool.end();

    const pool = new Pool({
        connectionString: testDbUrl
    })

    const db = drizzle(pool, { schema, casing: "snake_case"});

    await migrate(db, {migrationsFolder: 'src/db/migrations'});

    return {pool, db, testDbName}
}

export async function destroyTestDb({pool, testDbName}: TestDbContext){
    await pool.end();

    const adminPool = new Pool({
        connectionString: adminDbUrl
    })

    await adminPool.query(
        `
        SELECT pg_terminate_backend(pid)
        FROM pg_stat_activity
        WHERE datname = $1
            AND pid <> pg_backend_pid()
        `,
        [testDbName]
    )

    await adminPool.query(`DROP DATABASE IF EXISTS ${testDbName}`);
    await adminPool.end();
}

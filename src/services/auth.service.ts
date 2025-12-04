import { eq } from 'drizzle-orm';
import { db } from '../db/db';
import { usersTable } from '../db/schema';
import { blacklistTokensTable } from '../db/schema/blacklistTokensTable';
import { hash, verify } from '@node-rs/argon2';
import { RegisterInput } from '../schemas/auth/register.schema';
import { LoginInput } from '../schemas/auth/login.schema';
import { SignJWT } from 'jose';
import { randomUUIDv7 } from 'bun';

async function generateToken(userId: string): Promise<string>{
    const jwtSecret = process.env.JWT_SECRET;
    const jti = randomUUIDv7()
    if(!jwtSecret){
        throw new Error('No JWT secret provided')
    }
    const secret = new TextEncoder().encode(jwtSecret);
    return await new SignJWT({ userId })
        .setProtectedHeader({ alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime('3h')
        .setJti(jti)
        .sign(secret)
}

export async function register(input: RegisterInput){
    const normalizedEmail = input.email.trim().toLowerCase();
    // check if user is already registered
    const [user] = await db
        .select({id: usersTable.id})
        .from(usersTable)
        .where(eq(usersTable.email, normalizedEmail))

    // if the user is valid then throw an Error
    if(user){
        throw new Error('This email is already registered.')
    }

    const hashedPassword = await hash(input.password)
    const [newUser] = await db.insert(usersTable).values({
        username: input.username,
        email: normalizedEmail,
        password_hash: hashedPassword
    }).returning({ id: usersTable.id })

    if(!newUser){
        throw new Error('Failed creating a user.')
    }

    return { userId: newUser.id }
}

export async function login(input: LoginInput){
    // normalize the email
    const normalizedEmail = input.email.trim().toLocaleLowerCase();
    const [user] = await db
        .select({
            id: usersTable.id,
            password_hash: usersTable.password_hash
        })
        .from(usersTable)
        .where(eq(usersTable.email, normalizedEmail))

    const passwordMatch = user? verify(user.password_hash, input.password) : false;

    if(!passwordMatch){
        throw new Error('Invalid Credential');
    }

    const token = await generateToken(user.id);
    return { token };
}

export async function logout(jti: string, exp: Date){   
    try{
        await db.insert(blacklistTokensTable).values({
            jti: jti,
            expired_at: exp
        })
    } catch (error){
        console.error('Error revoking token: ' + error);
        throw new Error('Failed to log out session');
    }
}
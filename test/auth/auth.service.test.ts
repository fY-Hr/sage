import { describe, it, expect, beforeEach, afterEach, mock } from 'bun:test';
import { login, register, logout } from '../../src/services/auth.service'
import { jwtVerify } from 'jose';
import { createTestDb, destroyTestDb, TestDbContext } from './setup-auth-test-db';
import { LoginInput, RegisterInput } from '../../src/schemas/auth';


let ctx: TestDbContext | null = null;

beforeEach(async () => {
    ctx = await createTestDb();

    if(!ctx) throw new Error('Failed to create test db');

    await mock.module('../../src/db/db', () => ({
        db: ctx?.db
    }));
}, {timeout: 15000})

afterEach(async () => {
    if(ctx){
        try{
            await destroyTestDb(ctx);
        } catch (error){
            console.error('Error destroying test db: ', error);
        }
    }
    ctx = null
}, {timeout: 10000})


describe('Register test', () => {
    it('UserId must be defined', async () =>{
        const newUser: RegisterInput = {
            username: 'test-username',
            email: 'testmail@gmail.com',
            password: 'password123'
        };            

        const user = await register(newUser);

        expect(user.userId).toBeDefined();
    })
})

describe('Login test', () => {
    it('Should return token', async () => {
        const newUser: RegisterInput = {
            username: 'test-username',
            email: 'testmail@gmail.com',
            password: 'password123'
        };            

        const user = await register(newUser);

        if(!user){
            throw new Error()
        }
        const loginUser: LoginInput = {
            email: newUser.email,
            password: newUser.password
        }

        const loggedUser = await login(loginUser);

        expect(loggedUser.token).toBeDefined();
    })
})

describe('Logout test', () => {
    it('Should return Logout successful', async () => {
        const newUser: RegisterInput = {
            username: 'test-username',
            email: 'testmail@gmail.com',
            password: 'password123'
        };            

        const user = await register(newUser);

        if(!user){
            throw new Error()
        }
        const loginUser: LoginInput = {
            email: newUser.email,
            password: newUser.password
        }

        const loggedUser = await login(loginUser);
        const rawToken = loggedUser?.token;

        const token = rawToken.startsWith('Bearer') ? rawToken.substring(7) : rawToken;

        const jwtSecretRaw = process.env.JWT_SECRET;
        if(!jwtSecretRaw) throw new Error('JWT_SECRET is not set in environtment variable');
        const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET)

        const { payload } = await jwtVerify(token, jwtSecret, {
            requiredClaims: ['jti', 'exp', 'userId']
        })

        const expDate = new Date(payload.exp as number * 1000)

        const message = await logout(payload.jti as string, expDate);

        expect(message).toEqual({message: 'Logout successful'});

    })
})
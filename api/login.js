import { db } from '@vercel/postgres';
import { Redis } from '@upstash/redis';
import { arrayBufferToBase64, stringToArrayBuffer } from '../lib/base64';

export const config = {
    runtime: 'edge',
};

const redis = Redis.fromEnv();

export default async function handler(request) {
    try {
        // Parse the incoming request body
        const { username, password } = await request.json();

        // Generate a hashed password (SHA-256)
        const hash = await crypto.subtle.digest('SHA-256', stringToArrayBuffer(username + password));
        const hashed64 = arrayBufferToBase64(hash);

        // Connect to the database
        const client = await db.connect();

        // Query the database for the user
        const { rowCount, rows } = await client.sql`
            SELECT * FROM users WHERE username = ${username} AND password = ${hashed64}
        `;

        // If no user is found, return an error
        if (rowCount !== 1) {
            const error = { code: 'UNAUTHORIZED', message: 'Identifiant ou mot de passe incorrect' };
            return new Response(JSON.stringify(error), {
                status: 401,
                headers: { 'content-type': 'application/json' },
            });
        }

        // Update the last login timestamp
        await client.sql`UPDATE users SET last_login = NOW() WHERE user_id = ${rows[0].user_id}`;

        // Generate a unique session token
        const token = crypto.randomUUID();

        // Extract user details
        const user = {
            id: rows[0].user_id,
            username: rows[0].username,
            email: rows[0].email,
            externalId: rows[0].external_id,
        };

        // Store the token in Redis with a 1-hour expiry
        await redis.set(token, JSON.stringify(user), { ex: 3600 });

        // Store user details in a Redis hash for quick access
        await redis.hset(`users:${user.id}`, user);

        // Return the token and user details
        return new Response(JSON.stringify({ token, username: user.username, externalId: user.externalId, id: user.id }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
        });
    } catch (error) {
        // Log the error (for debugging only; anonymize for production)
        console.error('Login Error:', error);

        // Return a generic server error response
        return new Response(JSON.stringify({ code: 'SERVER_ERROR', message: 'Une erreur interne est survenue.' }), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        });
    }
}

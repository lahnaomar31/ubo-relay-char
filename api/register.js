import { sql } from "@vercel/postgres";
import { stringToArrayBuffer, arrayBufferToBase64 } from "../lib/base64";

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    if (request.method !== 'POST') {
        return new Response('Méthode non autorisée', { status: 405 });
    }

    try {
        const { username, email, password } = await request.json();

        // Hashage du mot de passe
        const hash = await crypto.subtle.digest('SHA-256', stringToArrayBuffer(username + password));
        const hashed64 = arrayBufferToBase64(hash);

        // Connexion à la base de données et insertion de l'utilisateur
        const { rowCount } = await sql`
            INSERT INTO users (username, email, password, external_id) 
            VALUES (${username}, ${email}, ${hashed64}, ${crypto.randomUUID().toString()})
        `;

        if (rowCount === 1) {
            return new Response(JSON.stringify({ message: 'Utilisateur enregistré avec succès' }), {
                status: 200,
                headers: { 'content-type': 'application/json' },
            });
        } else {
            return new Response(JSON.stringify({ error: 'Échec de l\'enregistrement' }), {
                status: 500,
                headers: { 'content-type': 'application/json' },
            });
        }
    } catch (error) {
        console.log("Erreur lors de l'enregistrement :", error);
        return new Response(JSON.stringify({ error: 'Erreur serveur lors de l\'enregistrement' }), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        });
    }
}

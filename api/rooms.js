import { sql } from "@vercel/postgres";
import { checkSession, unauthorizedResponse } from "../lib/session";

export const config = {
  runtime: "edge",
};

export default async function handler(request) {
  try {
    // Vérifier si l'utilisateur est connecté
    const connected = await checkSession(request);
    if (!connected) {
      console.log("Not connected");
      return unauthorizedResponse();
    }

    // Récupérer la liste des salons
    const { rowCount, rows } = await sql`
      SELECT room_id, name, TO_CHAR(created_on, 'DD/MM/YYYY HH24:MI') AS created_on
      FROM rooms
      ORDER BY created_on ASC`;

    console.log("Got " + rowCount + " rooms");

    if (rowCount === 0) {
      // Aucun salon trouvé (gère le bug Vercel similaire à `users.js`)
      return new Response("[]", {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    } else {
      // Retourner les salons trouvés
      return new Response(JSON.stringify(rows), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}

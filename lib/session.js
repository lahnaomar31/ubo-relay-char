import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function getConnecterUser(request) {
    let token = new Headers(request.headers).get('Authorization'); // Utilise 'Authorization' au lieu de 'Authentication'
    if (!token) {
        return null;
    }
    token = token.replace("Bearer ", "");
    console.log("checking " + token);
    const user = await redis.get(token);
    if (user) {
        console.log("Got user : " + user.username);
    } else {
        console.log("User not found in Redis for token: " + token);
    }
    return user;
}

export async function checkSession(request) {
    const user = await getConnecterUser(request);
    return (user !== undefined && user !== null && user);
}

export function triggerNotConnected(res) {
    return res.status(401).json({ error: "User not connected" });
}


export function unauthorizedResponse() {
    const error = {code: "UNAUTHORIZED", message: "Session expired"};
    return new Response(JSON.stringify(error), {
        status: 401,
        headers: {'content-type': 'application/json'},
    });
}

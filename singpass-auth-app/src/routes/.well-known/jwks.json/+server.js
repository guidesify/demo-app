import { json } from '@sveltejs/kit';
import { serverConfig } from '$lib/server-config.js';

/**
 * GET endpoint for JWKS (JSON Web Key Set)
 * Exposes public keys for JWT verification
 */
export async function GET() {
    return json({
        keys: [
            serverConfig.KEYS.PUBLIC_SIG_KEY,
            serverConfig.KEYS.PUBLIC_ENC_KEY
        ]
    });
}
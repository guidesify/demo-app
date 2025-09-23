import { getOIDCClient, serverConfig } from '$lib/server-config.js';
import { generators } from 'openid-client';
import * as crypto from 'crypto';

/**
 * GET /api/login - Handle login initiation
 */
export async function GET({ cookies }) {
	try {
		// Get the OIDC client
		const singpassClient = await getOIDCClient();
		
		// Generate PKCE parameters
		const code_verifier = generators.codeVerifier();
		const code_challenge = generators.codeChallenge(code_verifier);
		const nonce = crypto.randomUUID();
		const state = crypto.randomBytes(16).toString('hex');
		
		// Store auth state in secure httpOnly cookies
		const authState = { code_verifier, nonce, state };
		cookies.set('auth_state', JSON.stringify(authState), {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: 60 * 10, // 10 minutes
			path: '/'
		});
		
		// Generate authorization URL
		const authorizationUrl = singpassClient.authorizationUrl({
			redirect_uri: serverConfig.REDIRECT_URI,
			code_challenge_method: 'S256',
			code_challenge,
			nonce,
			state,
			scope: serverConfig.SCOPES,
		});
		
		// Give URL to client to redirect
		return new Response(null, {
            status: 200,
            headers: { 'Location': authorizationUrl }
        });
	} catch (error) {
		// Only log actual errors, not redirect responses
		if (!(error instanceof Error && 'status' in error && error.status === 302)) {
			console.error('[ERROR]: Login initiation failed:', error);
		}
		// Re-throw redirect responses or redirect to error page
		if (error instanceof Error && 'status' in error && error.status === 302) {
			throw error;
		}
		return new Response('Login initiation failed', { status: 500 });
	}
}
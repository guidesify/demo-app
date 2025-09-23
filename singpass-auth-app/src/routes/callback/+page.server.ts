import { redirect, error } from '@sveltejs/kit';
import { getOIDCClient, serverConfig } from '$lib/server-config.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url, cookies }) {
	const receivedQueryParams = url.searchParams;
	const code = receivedQueryParams.get('code');
	const state = receivedQueryParams.get('state');
	const error_param = receivedQueryParams.get('error');
	const error_description = receivedQueryParams.get('error_description');

	// Handle OAuth error responses
	if (error_param) {
		console.error('OAuth error:', error_param, error_description);
		throw error(400, {
			message: error_description || 'Authentication failed'
		});
	}

	// Validate required parameters
	if (!code) {
		throw error(400, {
			message: 'Missing authorization code'
		});
	}

	try {
		// Get stored auth state from cookies
		const authStateJson = cookies.get('auth_state');
		if (!authStateJson) {
			throw error(400, {
				message: 'Missing authentication state'
			});
		}

		const { code_verifier, nonce, state: expectedState } = JSON.parse(authStateJson);

		// Get the OIDC client
		const singpassClient = await getOIDCClient();

		// Token request using openid-client (matches Node.js example)
		const tokenSet = await singpassClient.callback(
			serverConfig.REDIRECT_URI, 
			Object.fromEntries(receivedQueryParams), 
			{
				code_verifier,
				nonce,
				state: expectedState,
			}
		);

		console.log('These are the claims in the ID token:');
		console.log(tokenSet.claims());

		// Userinfo request (available only to apps with additional allowed scopes, beyond just 'openid')
		const userInfo = await singpassClient.userinfo(tokenSet);
		console.log('This is the user info returned:');
		console.log(userInfo);

		// Combine claims and user info (matching Node.js example)
		const user = { ...tokenSet.claims(), ...userInfo };

		// Store user session in secure cookie
		cookies.set('user_session', JSON.stringify(user), {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24, // 24 hours
			path: '/'
		});

		// Clear auth state cookie
		cookies.delete('auth_state', { path: '/' });

		// Return user information to the page
		return {
			success: true,
			user: user
		};

	} catch (err) {
		console.error('Callback processing error:', err);
		throw error(500, {
			message: 'Failed to complete authentication'
		});
	}
}
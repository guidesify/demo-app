// Client-side configuration - only public, non-sensitive data
import { dev } from '$app/environment';

/**
 * Public configuration safe for client-side use
 * Sensitive data should be handled server-side only
 */
export const config = {
	SERVER_PORT: 5173, // SvelteKit default port
	CLIENT_ID: 'RsrOy2iB0edR53TJSuD5ULad1pGmrVZL', // This is not sensitive, it's the public client ID
	ISSUER_URL: 'https://stg-id.singpass.gov.sg', // Public issuer URL
	REDIRECT_URI: 'http://localhost:5173/callback', // Public redirect URI
	SCOPES: 'openid uinfin name' // Public scopes
};

/**
 * Get OIDC discovery endpoint
 */
export function getDiscoveryUrl() {
	return `${config.ISSUER_URL}/.well-known/openid_configuration`;
}

/**
 * Generate authorization URL (client-side version)
 * @param {string} state - OIDC state parameter
 * @param {string} nonce - OIDC nonce parameter
 * @returns {string} Authorization URL
 */
export function getAuthorizationUrl(state, nonce) {
	const params = new URLSearchParams({
		response_type: 'code',
		client_id: config.CLIENT_ID,
		redirect_uri: config.REDIRECT_URI,
		scope: config.SCOPES,
		state: state,
		nonce: nonce
	});

	return `${config.ISSUER_URL}/oidc/authorize?${params.toString()}`;
}

/**
 * Get token endpoint URL
 */
export function getTokenUrl() {
	return `${config.ISSUER_URL}/oidc/token`;
}
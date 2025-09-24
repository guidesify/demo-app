// Server-side configuration with access to private environment variables
import { 
	SERVER_PORT,
	CLIENT_ID, 
	ISSUER_URL, 
	REDIRECT_URI, 
	SCOPES, 
	PRIVATE_SIG_KEY,
	PRIVATE_ENC_KEY
} from '$env/static/private';
import { PUBLIC_SIG_KEY, PUBLIC_ENC_KEY } from '$env/static/public';
import { Issuer, generators, custom } from 'openid-client';

/**
 * Parse JSON environment variable with error handling
 */
function parseEnvJSON(/** @type {string} */ envVar, /** @type {string} */ varName) {
	if (!envVar || envVar === 'undefined') {
		throw new Error(`Environment variable ${varName} is undefined or empty`);
	}
	try {
		return JSON.parse(envVar);
	} catch (/** @type {any} */ error) {
		throw new Error(`Failed to parse ${varName} as JSON: ${error.message}`);
	}
}

/**
 * Server-side configuration with sensitive data
 * This should only be used in server-side code (e.g., +page.server.js, API routes)
 */
export const serverConfig = {
	SERVER_PORT: parseInt(SERVER_PORT) || 3080,
	CLIENT_ID,
	ISSUER_URL,
	REDIRECT_URI,
	SCOPES,
	
	// JWT Keys parsed from environment variables
	KEYS: {
		PRIVATE_SIG_KEY: parseEnvJSON(PRIVATE_SIG_KEY, 'PRIVATE_SIG_KEY'),
		PRIVATE_ENC_KEY: parseEnvJSON(PRIVATE_ENC_KEY, 'PRIVATE_ENC_KEY'),
		PUBLIC_SIG_KEY: parseEnvJSON(PUBLIC_SIG_KEY, 'PUBLIC_SIG_KEY'),
		PUBLIC_ENC_KEY: parseEnvJSON(PUBLIC_ENC_KEY, 'PUBLIC_ENC_KEY')
	}
};

// Set HTTP timeout for OIDC requests
custom.setHttpOptionsDefaults({
	timeout: 15000,
});

// Initialize OIDC client
let singpassIssuer;
// OIDC Client instance (cached)
/** @type {any} */
let singpassClient;

/**
 * Initialize the Singpass OIDC client
 */
export async function initializeOIDCClient() {
	try {
		// Discover the issuer configuration
		singpassIssuer = await Issuer.discover(serverConfig.ISSUER_URL);
		
		// Create the client with proper configuration matching the Node.js example
		singpassClient = new singpassIssuer.Client(
			{
				client_id: serverConfig.CLIENT_ID,
				response_types: ['code'],
				token_endpoint_auth_method: 'private_key_jwt',
				id_token_signed_response_alg: 'ES256',
				userinfo_encrypted_response_alg: serverConfig.KEYS.PRIVATE_ENC_KEY.alg,
				userinfo_encrypted_response_enc: 'A256GCM',
				userinfo_signed_response_alg: serverConfig.KEYS.PRIVATE_SIG_KEY.alg,
			},
			{ 
				keys: [serverConfig.KEYS.PRIVATE_SIG_KEY, serverConfig.KEYS.PRIVATE_ENC_KEY] 
			}
		);
		
		console.log('[INFO]: Singpass OIDC client initialized');
		return singpassClient;
	} catch (error) {
		console.error('[ERROR]: Failed to initialize OIDC client:', error);
		throw error;
	}
}

/**
 * Get or initialize the OIDC client
 */
export async function getOIDCClient() {
	if (!singpassClient) {
		await initializeOIDCClient();
	}
	return singpassClient;
}

/**
 * Refresh issuer configuration (recommended to prevent caching indefinitely)
 */
export async function refreshIssuerConfig() {
	try {
		const newIssuerConfig = await Issuer.discover(serverConfig.ISSUER_URL);
		singpassClient = new newIssuerConfig.Client({
			client_id: serverConfig.CLIENT_ID,
			response_types: ['code'],
			token_endpoint_auth_method: 'private_key_jwt',
			id_token_signed_response_alg: 'ES256',
			userinfo_encrypted_response_alg: serverConfig.KEYS.PRIVATE_ENC_KEY.alg,
			userinfo_encrypted_response_enc: 'A256GCM',
			userinfo_signed_response_alg: serverConfig.KEYS.PRIVATE_SIG_KEY.alg,
		}, { 
			keys: [serverConfig.KEYS.PRIVATE_SIG_KEY, serverConfig.KEYS.PRIVATE_ENC_KEY] 
		});
		console.log('[INFO]: Issuer configuration refreshed');
	} catch (error) {
		console.error('[ERROR]: Failed to refresh issuer configuration:', error);
	}
}

// Refresh configuration every hour (matching Node.js example)
const ONE_HOUR_IN_MS = 60 * 60 * 1000;
setInterval(refreshIssuerConfig, ONE_HOUR_IN_MS);
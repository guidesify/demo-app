// Auth state management using Svelte 5 runes
import { browser } from '$app/environment';
import { config, getAuthorizationUrl } from './config.js';

// Reactive state using $state rune
let user = $state(/** @type {any} */ (null));
let loading = $state(false);
let error = $state(/** @type {string | null} */ (null));

// Derived reactive values using $derived rune
const isAuthenticated = $derived(user !== null);
const userName = $derived(user?.name || user?.preferred_username || 'Unknown User');

/**
 * Initialize auth state from localStorage if available
 */
function initAuth() {
	if (browser) {
		try {
			const storedUser = localStorage.getItem('singpass_user');
			if (storedUser) {
				user = JSON.parse(storedUser);
			}
		} catch (err) {
			console.error('Failed to parse stored user data:', err);
			localStorage.removeItem('singpass_user');
		}
	}
}

/**
 * Generate OIDC authorization URL
 */
function getAuthUrl() {
	const state = generateRandomString(32);
	const nonce = generateRandomString(32);
	
	// Store state and nonce for validation
	if (browser) {
		sessionStorage.setItem('oidc_state', state);
		sessionStorage.setItem('oidc_nonce', nonce);
	}

	return getAuthorizationUrl(state, nonce);
}

/**
 * Start the login process
 */
function login() {
	if (!browser) return;
	
	loading = true;
	error = null;
	
	try {
		const authUrl = getAuthUrl();
		window.location.href = authUrl;
	} catch (err) {
		error = 'Failed to initiate login process';
		loading = false;
		console.error('Login error:', err);
	}
}

/**
 * Handle logout
 */
function logout() {
	user = null;
	error = null;
	loading = false;
	
	if (browser) {
		localStorage.removeItem('singpass_user');
		sessionStorage.removeItem('oidc_state');
		sessionStorage.removeItem('oidc_nonce');
		
		// Redirect to home page
		window.location.href = '/';
	}
}

/**
 * Set user data after successful authentication
 */
function setUser(/** @type {any} */ userData) {
	user = userData;
	
	if (browser) {
		localStorage.setItem('singpass_user', JSON.stringify(userData));
	}
}

/**
 * Set error state
 */
function setError(/** @type {string | null} */ errorMessage) {
	error = errorMessage;
	loading = false;
}

/**
 * Set loading state
 */
function setLoading(/** @type {boolean} */ isLoading) {
	loading = isLoading;
}

/**
 * Generate a random string for OIDC state/nonce
 */
function generateRandomString(/** @type {number} */ length) {
	const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < length; i++) {
		result += charset.charAt(Math.floor(Math.random() * charset.length));
	}
	return result;
}

// Initialize auth state when module loads
initAuth();

// Export reactive getters for state values
export function getUser() { return user; }
export function getLoading() { return loading; }
export function getError() { return error; }
export function getIsAuthenticated() { return isAuthenticated; }
export function getUserName() { return userName; }

// Export actions
export { login, logout, setUser, setError, setLoading, config };
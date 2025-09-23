// Simplified auth state - no client-side auth logic needed (matches Node.js patterns)
// Authentication is handled entirely server-side via cookies

/**
 * Check if user is authenticated by making a server request
 * This matches typical Node.js patterns where auth state is server-side only
 */
export async function checkAuthStatus() {
	try {
		const res = await fetch('/api/user');
		if (res.ok) {
			return await res.json();
		}
		return null;
	} catch {
		return null;
	}
}
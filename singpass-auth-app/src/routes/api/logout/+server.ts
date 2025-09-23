
/**
 * GET /api/logout - Handle logout
 */
export async function GET({ cookies }) {
	// Clear all auth-related cookies
	cookies.delete('user_session', { path: '/' });
	cookies.delete('auth_state', { path: '/' });
	
	// Return url to home page for client to redirect
	return new Response(null, {
        status: 200,
        headers: { 'Location': '/' }
    });
}
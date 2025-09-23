import { json, error } from '@sveltejs/kit';

/**
 * GET /api/user - Get current user information
 */
export async function GET({ cookies }) {
	try {
		const userSession = cookies.get('user_session');
		
		if (userSession) {
			const user = JSON.parse(userSession);
			return json(user);
		} else {
			throw error(401, 'Not authenticated');
		}
	} catch (err) {
		console.error('[ERROR]: Failed to get user info:', err);
		throw error(401, 'Not authenticated');
	}
}
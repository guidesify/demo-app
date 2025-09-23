// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			message: string;
			details?: string;
			status?: number;
		}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module '$env/static/private' {
	export const SERVER_PORT: string;
	export const CLIENT_ID: string;
	export const ISSUER_URL: string;
	export const REDIRECT_URI: string;
	export const SCOPES: string;
	export const PRIVATE_SIG_KEY: string;
	export const PRIVATE_ENC_KEY: string;
	export const PUBLIC_SIG_KEY: string;
	export const PUBLIC_ENC_KEY: string;
}

export {};
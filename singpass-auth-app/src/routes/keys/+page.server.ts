import { generateKeyPair, exportJWK } from 'jose';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	// Generate keys on page load
	const keys = await generateNewKeys();
	return {
		keys
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	generate: async () => {
		const keys = await generateNewKeys();
		return {
			success: true,
			keys
		};
	}
};

/**
 * Generate new ECDSA signing and ECDH encryption key pairs
 * Matches the exact structure of working Singpass keys
 */
async function generateNewKeys() {
	try {
		// Generate EC key pair for ES256 signing
		const { privateKey: sigPrivate, publicKey: sigPublic } = await generateKeyPair('ES256');
		const privateSigKeyRaw = await exportJWK(sigPrivate);
		const publicSigKeyRaw = await exportJWK(sigPublic);
		
		// Build signing keys with exact structure as working keys
		const privateSigKey = {
			alg: "ES256",
			kty: privateSigKeyRaw.kty,
			x: privateSigKeyRaw.x,
			y: privateSigKeyRaw.y,
			crv: privateSigKeyRaw.crv,
			d: privateSigKeyRaw.d,
			kid: "my-sig-key"
		};
		
		const publicSigKey = {
			alg: "ES256",
			kty: publicSigKeyRaw.kty,
			x: publicSigKeyRaw.x,
			y: publicSigKeyRaw.y,
			crv: publicSigKeyRaw.crv,
			use: "sig",
			kid: "my-sig-key"
		};

		// Generate EC key pair for ECDH-ES+A256KW encryption  
		const { privateKey: encPrivate, publicKey: encPublic } = await generateKeyPair('ECDH-ES');
		const privateEncKeyRaw = await exportJWK(encPrivate);
		const publicEncKeyRaw = await exportJWK(encPublic);
		
		// Build encryption keys with exact structure as working keys
		const privateEncKey = {
			alg: "ECDH-ES+A256KW",
			kty: privateEncKeyRaw.kty,
			x: privateEncKeyRaw.x,
			y: privateEncKeyRaw.y,
			crv: privateEncKeyRaw.crv,
			d: privateEncKeyRaw.d,
			kid: "my-enc-key"
		};
		
		const publicEncKey = {
			alg: "ECDH-ES+A256KW",
			kty: publicEncKeyRaw.kty,
			x: publicEncKeyRaw.x,
			y: publicEncKeyRaw.y,
			crv: publicEncKeyRaw.crv,
			use: "enc",
			kid: "my-enc-key"
		};

		// Validate key structure matches working format
		console.log('Generated private sig key structure:', Object.keys(privateSigKey));
		console.log('Generated private enc key structure:', Object.keys(privateEncKey));
		console.log(privateEncKey)
		
		return {
			PRIVATE_SIG_KEY: JSON.stringify(privateSigKey),
			PRIVATE_ENC_KEY: JSON.stringify(privateEncKey),
			PUBLIC_SIG_KEY: JSON.stringify(publicSigKey),
			PUBLIC_ENC_KEY: JSON.stringify(publicEncKey)
		};
	} catch (error) {
		console.error('Key generation error:', error);
		throw new Error('Failed to generate keys');
	}
}
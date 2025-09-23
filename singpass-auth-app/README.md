# Singpass Auth App

A modern SvelteKit application with Svelte 5 runes for Singpass OpenID Connect (OIDC) authentication.

## Features

- ✅ **Svelte 5 with Runes**: Uses the latest Svelte 5 reactive syntax (`$state`, `$derived`, `$effect`)
- 🔐 **Singpass OIDC Integration**: Complete OpenID Connect authentication flow
- 🛡️ **Security-First**: Proper separation of client/server configurations
- 🎨 **Modern UI**: Responsive design with smooth animations
- 🔧 **TypeScript Support**: Full type safety throughout the application
- ⚡ **Fast Development**: Powered by Vite for instant HMR

## Prerequisites

- **Node.js** (version 18 or later)
- **npm** (Node Package Manager)

## Quick Start

### 1. Clone & Install

```bash
git clone <repository-url>
cd singpass-auth-app
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```bash
# Singpass OIDC Configuration
SERVER_PORT=5173
CLIENT_ID=your_client_id_here
ISSUER_URL=https://stg-id.singpass.gov.sg
REDIRECT_URI=http://localhost:5173/callback
SCOPES="openid uinfin name"

# JWT Keys (JSON format)
PRIVATE_SIG_KEY={"alg":"ES256","kty":"EC",...}
PRIVATE_ENC_KEY={"alg":"ECDH-ES+A256KW","kty":"EC",...}
PUBLIC_SIG_KEY={"alg":"ES256","kty":"EC",...}
PUBLIC_ENC_KEY={"alg":"ECDH-ES+A256KW","kty":"EC",...}
```

### 3. Start Development

```bash
npm run dev
```

The application will be available at **[http://localhost:5173](http://localhost:5173)**

## Project Structure

```
singpass-auth-app/
├── src/
│   ├── lib/
│   │   ├── auth.svelte.js      # 🔥 Svelte 5 reactive auth state
│   │   ├── config.js           # Client-side configuration
│   │   └── server-config.js    # Server-side configuration (sensitive data)
│   ├── routes/
│   │   ├── +page.svelte        # 🏠 Main login page with runes
│   │   ├── +error.svelte       # ❌ Error handling page
│   │   └── callback/
│   │       ├── +page.server.js # 🔐 Server-side token exchange
│   │       └── +page.svelte    # ✅ Callback processing page
│   ├── app.d.ts               # TypeScript declarations
│   └── app.html               # HTML template
├── static/                    # Static assets
├── .env                      # 🔑 Environment variables (create this!)
└── package.json              # Dependencies & scripts
```

## Key Technologies

- **[SvelteKit](https://kit.svelte.dev/)**: Full-stack framework
- **[Svelte 5](https://svelte.dev/)**: Reactive UI with runes
- **[jose](https://github.com/panva/jose)**: JWT handling
- **[TypeScript](https://www.typescriptlang.org/)**: Type safety
- **[Vite](https://vitejs.dev/)**: Build tool & dev server

## Authentication Flow

1. **Login Initiation** → User clicks "Login with Singpass"
2. **OIDC Redirect** → App redirects to Singpass authorization server
3. **User Authentication** → User authenticates with Singpass
4. **Callback Processing** → Singpass redirects back with authorization code
5. **Token Exchange** → Server exchanges code for ID/access tokens
6. **Token Verification** → Server verifies JWT signature and claims
7. **User Session** → App stores user info and shows authenticated state

## Svelte 5 Runes Usage

This app showcases modern Svelte 5 reactive patterns:

```javascript
// Reactive state
let user = $state(null);
let loading = $state(false);

// Derived values
const isAuthenticated = $derived(user !== null);
const userName = $derived(user?.name || 'Unknown');

// Side effects
$effect(() => {
  if (isAuthenticated) {
    console.log('User logged in:', userName);
  }
});
```

## Security Features

- 🔒 **Environment Variables**: Sensitive data via `.env`
- 🛡️ **Server-Side JWT**: Token handling on server only
- 🔐 **Client Assertion**: JWT-based client authentication
- ✅ **Token Verification**: Full JWT signature & claims validation
- 🚫 **No Client Secrets**: Secure OIDC public client pattern

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Type checking
npm run check

# Build for production
npm run build

# Preview production build
npm run preview
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**: App uses port 5173 by default
2. **Environment Variables**: Ensure `.env` file is properly configured
3. **CORS Issues**: Check redirect URI matches exactly
4. **JWT Errors**: Verify key formats in environment variables

### Need Help?

- Check browser console for client-side errors
- Check terminal output for server-side errors
- Verify all environment variables are set correctly
- Ensure Singpass client configuration matches your setup

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
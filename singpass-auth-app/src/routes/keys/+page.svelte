<script>
  import { enhance } from '$app/forms';

  // Props from server load function
  let { data, form } = $props();
  
  // Use form data if available (after generation), otherwise use initial data
  const keys = $derived(form?.keys || data.keys);

  // Parse keys to validate structure
  let parsedKeys = $derived(() => {
    try {
      return {
        privateSig: JSON.parse(keys.PRIVATE_SIG_KEY),
        privateEnc: JSON.parse(keys.PRIVATE_ENC_KEY),
        publicSig: JSON.parse(keys.PUBLIC_SIG_KEY),
        publicEnc: JSON.parse(keys.PUBLIC_ENC_KEY)
      };
    } catch (e) {
      console.error('Failed to parse keys:', e);
      return {
        privateSig: {},
        privateEnc: {},
        publicSig: {},
        publicEnc: {}
      };
    }
  });

  async function copyToClipboard(/** @type {string} */ text) {
    try {
      await navigator.clipboard.writeText(text);
      // Simple feedback - could be enhanced with a toast notification
      console.log('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  }

  function copyAllKeys() {
    const allKeys = `PRIVATE_SIG_KEY=${keys.PRIVATE_SIG_KEY}
PRIVATE_ENC_KEY=${keys.PRIVATE_ENC_KEY}  
PUBLIC_SIG_KEY=${keys.PUBLIC_SIG_KEY}
PUBLIC_ENC_KEY=${keys.PUBLIC_ENC_KEY}`;
    copyToClipboard(allKeys);
  }
</script>

<svelte:head>
  <title>Key Generator - Singpass Demo App</title>
</svelte:head>

<main>
  <h1>Singpass JWT Key Generator</h1>
  
  <p>Use this tool to generate new JWT keys for your Singpass OIDC configuration.</p>
  
  <div class="actions">
    <form method="POST" action="?/generate" use:enhance>
      <button type="submit" class="btn btn-primary">Generate New Keys</button>
    </form>
    
    <button onclick={copyAllKeys} class="btn btn-secondary">Copy All Keys</button>
    
    <a href="/" class="btn btn-link">← Back to Home</a>
  </div>

  <div class="keys-container">
    <h2>Environment Variables</h2>
    <p class="note">Copy these values to your .env file:</p>
    
    <div class="key-section">
      <div class="key-line">
        <span class="key-name">PRIVATE_SIG_KEY=</span><code class="key-value">{keys.PRIVATE_SIG_KEY}</code>
        <button onclick={() => copyToClipboard(`PRIVATE_SIG_KEY=${keys.PRIVATE_SIG_KEY}`)} class="copy-btn" title="Copy">📋</button>
      </div>
    </div>

    <div class="key-section">
      <div class="key-line">
        <span class="key-name">PRIVATE_ENC_KEY=</span><code class="key-value">{keys.PRIVATE_ENC_KEY}</code>
        <button onclick={() => copyToClipboard(`PRIVATE_ENC_KEY=${keys.PRIVATE_ENC_KEY}`)} class="copy-btn" title="Copy">📋</button>
      </div>
    </div>

    <div class="key-section">
      <div class="key-line">
        <span class="key-name">PUBLIC_SIG_KEY=</span><code class="key-value">{keys.PUBLIC_SIG_KEY}</code>
        <button onclick={() => copyToClipboard(`PUBLIC_SIG_KEY=${keys.PUBLIC_SIG_KEY}`)} class="copy-btn" title="Copy">📋</button>
      </div>
    </div>

    <div class="key-section">
      <div class="key-line">
        <span class="key-name">PUBLIC_ENC_KEY=</span><code class="key-value">{keys.PUBLIC_ENC_KEY}</code>
        <button onclick={() => copyToClipboard(`PUBLIC_ENC_KEY=${keys.PUBLIC_ENC_KEY}`)} class="copy-btn" title="Copy">📋</button>
      </div>
    </div>
  </div>

  <div class="validation">
    <h3>✅ Key Structure Validation</h3>
    <p>Generated keys structure:</p>
    <div class="structure-check">
      <div class="key-structure">
        <h4>PRIVATE_SIG_KEY:</h4>
        <code>{JSON.stringify(Object.keys(parsedKeys().privateSig))}</code>
        <span class="expected">Expected: ["alg","kty","x","y","crv","d","kid"]</span>
      </div>
      <div class="key-structure">
        <h4>PRIVATE_ENC_KEY:</h4>
        <code>{JSON.stringify(Object.keys(parsedKeys().privateEnc))}</code>
        <span class="expected">Expected: ["alg","kty","x","y","crv","d","kid"]</span>
      </div>
      <div class="key-structure">
        <h4>PUBLIC_SIG_KEY:</h4>
        <code>{JSON.stringify(Object.keys(parsedKeys().publicSig))}</code>
        <span class="expected">Expected: ["alg","kty","x","y","crv","use","kid"]</span>
      </div>
      <div class="key-structure">
        <h4>PUBLIC_ENC_KEY:</h4>
        <code>{JSON.stringify(Object.keys(parsedKeys().publicEnc))}</code>
        <span class="expected">Expected: ["alg","kty","x","y","crv","use","kid"]</span>
      </div>
    </div>
  </div>

  <div class="warning">
    <h3>⚠️ Security Warning</h3>
    <p>These keys contain sensitive private key material. Keep them secure and never expose them in client-side code or public repositories.</p>
  </div>
</main>

<style>
  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: system-ui, sans-serif;
  }

  h1 {
    color: #333;
    margin-bottom: 1rem;
  }

  h2 {
    color: #555;
    margin: 2rem 0 1rem 0;
  }

  .actions {
    display: flex;
    gap: 1rem;
    margin: 2rem 0;
    align-items: center;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    transition: background-color 0.2s;
  }

  .btn-primary {
    background: #f4333d;
    color: white;
  }

  .btn-primary:hover {
    background: #b0262d;
  }

  .btn-secondary {
    background: #6c757d;
    color: white;
  }

  .btn-secondary:hover {
    background: #5a6268;
  }

  .btn-link {
    background: transparent;
    color: #0066cc;
    text-decoration: underline;
  }

  .keys-container {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    padding: 1.5rem;
    margin: 2rem 0;
  }

  .note {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }

  .key-section {
    margin-bottom: 1rem;
  }

  .key-line {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.75rem;
    background: white;
    border: 1px solid #ced4da;
    border-radius: 4px;
    word-break: break-all;
  }

  .key-name {
    font-weight: 600;
    color: #495057;
    flex-shrink: 0;
    font-family: monospace;
  }

  .key-value {
    background: #f8f9fa;
    padding: 0.25rem 0.5rem;
    border-radius: 3px;
    font-family: monospace;
    font-size: 0.9rem;
    flex-grow: 1;
    overflow-wrap: break-word;
  }

  .copy-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 3px;
    font-size: 1rem;
    flex-shrink: 0;
    opacity: 0.6;
    transition: opacity 0.2s;
  }

  .copy-btn:hover {
    opacity: 1;
    background: #e9ecef;
  }

  .validation {
    background: #d4edda;
    border: 1px solid #c3e6cb;
    border-radius: 8px;
    padding: 1.5rem;
    margin: 2rem 0;
  }

  .validation h3 {
    color: #155724;
    margin-bottom: 0.5rem;
  }

  .validation p {
    color: #155724;
    margin-bottom: 1rem;
  }



  .structure-check {
    background: white;
    border: 1px solid #c3e6cb;
    border-radius: 4px;
    padding: 1rem;
  }

  .key-structure {
    margin-bottom: 1rem;
    padding: 0.5rem;
    border-left: 3px solid #28a745;
    background: #f8f9fa;
  }

  .key-structure h4 {
    margin: 0 0 0.5rem 0;
    color: #155724;
    font-size: 0.9rem;
  }

  .key-structure code {
    display: block;
    background: #e9ecef;
    padding: 0.25rem 0.5rem;
    border-radius: 3px;
    font-size: 0.8rem;
    margin-bottom: 0.25rem;
  }

  .expected {
    font-size: 0.8rem;
    color: #6c757d;
    font-style: italic;
  }

  .warning {
    background: #fff3cd;
    border: 1px solid #ffeaa7;
    border-radius: 8px;
    padding: 1.5rem;
    margin: 2rem 0;
  }

  .warning h3 {
    color: #856404;
    margin-bottom: 0.5rem;
  }

  .warning p {
    color: #856404;
    margin: 0;
  }
</style>
<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';

  // Props from server load function
  let { data } = $props();

  // Simple redirect on successful auth (like Node.js examples)
  onMount(() => {
    if (browser && data.success && data.user) {
      // Immediate redirect like Node.js examples typically do
      setTimeout(() => {
        goto('/', { replaceState: true });
      }, 1500);
    }
  });
</script>

<!-- Simple callback page like Node.js examples -->
{#if data.success && data.user}
  <h1>Authentication Successful</h1>
  <p>Welcome, {data.user.name?.value || data.user.name || 'User'}!</p>
  <p>Your UINFIN is {data.user.uinfin?.value || data.user.uinfin}</p>
  <p>Redirecting to home page...</p>
  <a href="/">Continue to Home</a>
{:else}
  <h1>Authentication Failed</h1>
  <p>There was an error processing your authentication.</p>
  <a href="/">Return to Home</a>
{/if}

<style>
  /* Simple callback page styling like Node.js examples */
  h1 {
    color: #333;
    margin-bottom: 1rem;
  }
  
  p {
    margin-bottom: 1rem;
    line-height: 1.5;
  }
  
  a {
    color: #0066cc;
    text-decoration: underline;
  }
</style>
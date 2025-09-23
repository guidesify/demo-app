<script>
  import { page } from '$app/stores';
</script>

<!-- Simple error page like Node.js examples -->
<h1>Error {$page.error?.status || 500}</h1>
<p>{$page.error?.message || 'An unexpected error occurred'}</p>

{#if $page.error?.details}
  <details>
    <summary>Technical Details</summary>
    <pre>{$page.error.details}</pre>
  </details>
{/if}

<p>
  <a href="/">Go Home</a> |
  <button onclick={() => window.location.reload()}>Try Again</button>
</p>

<style>
  /* Simple error page styling like Node.js examples */
  h1 {
    color: #d32f2f;
    margin-bottom: 1rem;
  }
  
  p {
    margin-bottom: 1rem;
    line-height: 1.5;
  }
  
  details {
    margin: 1rem 0;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: #f9f9f9;
  }
  
  pre {
    background: #f5f5f5;
    padding: 0.5rem;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 0.9rem;
  }
  
  a {
    color: #0066cc;
    text-decoration: underline;
    margin: 0 0.5rem;
  }
  
  button {
    background: none;
    border: none;
    color: #0066cc;
    text-decoration: underline;
    cursor: pointer;
    margin: 0 0.5rem;
    font: inherit;
  }
</style>
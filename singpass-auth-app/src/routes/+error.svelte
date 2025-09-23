<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  function handleGoHome() {
    goto('/', { replaceState: true });
  }
</script>

<main>
  <div class="container">
    <div class="error-content">
      <div class="error-icon">⚠️</div>
      <h1>Oops! Something went wrong</h1>
      
      <div class="error-details">
        <h2>Error {$page.error?.status || 500}</h2>
        <p class="error-message">
          {$page.error?.message || 'An unexpected error occurred'}
        </p>
        
        {#if $page.error?.details}
          <details class="error-details-toggle">
            <summary>Technical Details</summary>
            <p class="technical-details">{$page.error.details}</p>
          </details>
        {/if}
      </div>

      <div class="actions">
        <button onclick={handleGoHome} class="btn btn-primary">
          Go Home
        </button>
        <button onclick={() => window.location.reload()} class="btn btn-secondary">
          Try Again
        </button>
      </div>
    </div>
  </div>
</main>

<style>
  main {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 1rem;
  }

  .container {
    max-width: 600px;
    width: 100%;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    padding: 3rem 2rem;
    text-align: center;
  }

  .error-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .error-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  h1 {
    color: #333;
    margin-bottom: 1rem;
    font-size: 2rem;
    font-weight: 600;
  }

  h2 {
    color: #dc3545;
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
  }

  .error-message {
    color: #666;
    font-size: 1.1rem;
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  .error-details-toggle {
    text-align: left;
    margin-top: 1rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #dee2e6;
  }

  .error-details-toggle summary {
    cursor: pointer;
    font-weight: 500;
    color: #6c757d;
  }

  .technical-details {
    margin-top: 0.5rem;
    font-family: monospace;
    font-size: 0.9rem;
    color: #495057;
    background: white;
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid #ced4da;
    overflow-wrap: break-word;
  }

  .actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 1.5rem;
  }

  .btn {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
  }

  .btn-primary {
    background: #667eea;
    color: white;
  }

  .btn-primary:hover {
    background: #5a6fd8;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  .btn-secondary {
    background: #6c757d;
    color: white;
  }

  .btn-secondary:hover {
    background: #5a6268;
  }

  @media (max-width: 600px) {
    .actions {
      flex-direction: column;
    }
    
    .btn {
      width: 100%;
    }
  }
</style>
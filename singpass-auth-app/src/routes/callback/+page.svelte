<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { setUser, setError, setLoading } from '$lib/auth.svelte.js';
  import { page } from '$app/stores';

  // Reactive state for callback page
  let status = $state('processing');
  let message = $state('Processing authentication...');
  let details = $state('');

  // Props from server load function using Svelte 5 runes
  let { data } = $props();

  // Handle the authentication result
  onMount(() => {
    if (browser) {
      handleAuthResult();
    }
  });

  function handleAuthResult() {
    try {
      if (data.success && data.user) {
        // Authentication successful
        status = 'success';
        message = 'Authentication successful!';
        details = `Welcome, ${data.user.name || data.user.preferred_username || 'User'}`;
        
        // Update auth state with user information
        setUser(data.user);
        setLoading(false);
        
        // Redirect to home page after a brief delay
        setTimeout(() => {
          goto('/', { replaceState: true });
        }, 2000);
        
      } else {
        throw new Error('Invalid authentication response');
      }
    } catch (err) {
      // Handle authentication error
      status = 'error';
      message = 'Authentication failed';
      details = (err instanceof Error) ? err.message : 'An unexpected error occurred';
      
      setError(details);
      setLoading(false);
      
      console.error('Authentication error:', err);
    }
  }

  function handleRetry() {
    goto('/', { replaceState: true });
  }
</script>

<main>
  <div class="container">
    <div class="callback-content">
      {#if status === 'processing'}
        <div class="processing">
          <div class="spinner"></div>
          <h2>{message}</h2>
          <p>Please wait while we verify your authentication...</p>
        </div>
      {:else if status === 'success'}
        <div class="success">
          <div class="success-icon">✓</div>
          <h2>{message}</h2>
          <p>{details}</p>
          <p class="redirect-message">Redirecting you to the application...</p>
        </div>
      {:else if status === 'error'}
        <div class="error">
          <div class="error-icon">✗</div>
          <h2>{message}</h2>
          <p>{details}</p>
          <button onclick={handleRetry} class="btn btn-primary">
            Return to Login
          </button>
        </div>
      {/if}
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
    max-width: 500px;
    width: 100%;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    padding: 3rem 2rem;
    text-align: center;
  }

  .callback-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .processing {
    animation: fadeIn 0.5s ease-in;
  }

  .success {
    animation: slideUp 0.6s ease-out;
  }

  .error {
    animation: shake 0.5s ease-in-out;
  }

  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1.5rem;
  }

  .success-icon {
    width: 80px;
    height: 80px;
    background: #28a745;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    font-weight: bold;
    margin: 0 auto 1rem;
    animation: bounceIn 0.8s ease-out;
  }

  .error-icon {
    width: 80px;
    height: 80px;
    background: #dc3545;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    font-weight: bold;
    margin: 0 auto 1rem;
  }

  h2 {
    color: #333;
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
    font-weight: 600;
  }

  p {
    color: #666;
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }

  .redirect-message {
    font-size: 0.9rem;
    color: #999;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
    margin-top: 1rem;
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

  /* Animations */
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { 
      transform: translateY(20px); 
      opacity: 0; 
    }
    to { 
      transform: translateY(0); 
      opacity: 1; 
    }
  }

  @keyframes bounceIn {
    0% { 
      transform: scale(0.3); 
      opacity: 0; 
    }
    50% { 
      transform: scale(1.05); 
    }
    70% { 
      transform: scale(0.9); 
    }
    100% { 
      transform: scale(1); 
      opacity: 1; 
    }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
    20%, 40%, 60%, 80% { transform: translateX(10px); }
  }
</style>
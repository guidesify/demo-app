<script>
  import { onMount } from 'svelte';

  let msg = $state('');
  let showLogin = $state(true);
  let showLogout = $state(false);

  // Check authentication status on mount
  onMount(async () => {
    try {
      const res = await fetch('/api/user');
      if (res.status === 200) {
        const userInfo = await res.json();
        msg = `Thanks for logging in ${userInfo.name?.value || userInfo.name}. Your UINFIN is ${userInfo.uinfin?.value || userInfo.uinfin}.`;
        showLogin = false;
        showLogout = true;
      } else {
        msg = 'You are not logged in.';
        showLogin = true;
        showLogout = false;
      }
    } catch (err) {
      msg = 'You are not logged in.';
      showLogin = true;
      showLogout = false;
    }
  });

  async function handleLogin() {
    const url = await fetch('/api/login');
    if (url.ok) {
      const redirectUrl = url.headers.get('Location');
      if (redirectUrl) {
      window.location.replace(redirectUrl);
      } else {
      console.error('No redirect URL found');
      msg = 'Login failed. Please try again.';
      }
    }
  }

  async function handleLogout() {
    const res = await fetch('/api/logout');
    if (res.ok) {
      const redirectUrl = res.headers.get('Location');
      if (redirectUrl) {
        window.location.replace(redirectUrl);
      } else {
        console.error('No redirect URL found');
        msg = 'Logout failed. Please try again.';
      }
    }
  }
</script>

<svelte:head>
  <title>Singpass Demo App</title>
</svelte:head>

<main>
  <h1>Singpass Demo App</h1>
  <a href="https://docs.developer.singpass.gov.sg" target="_blank">Documentation</a>
  <p id="msg">{msg}</p>
  <button class="btn" onclick={handleLogin} id="login" style:display={showLogin ? 'inline-flex' : 'none'}>
    Log in with <img src="/singpass.svg" alt="Singpass" />
  </button>
  <button class="btn" onclick={handleLogout} id="logout" style:display={showLogout ? 'inline-flex' : 'none'}>
    Log out
  </button>
</main>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&display=swap');

:root {
  --default: #f4333d;
  --hover: #b0262d;
  --active: #801e23;
}

* {
  font-family: 'Poppins', sans-serif;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

main {
  padding: 1rem;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
}

h1 {
  font-weight: 600;
  font-size: 2rem;
  line-height: 2.5rem;
}

.btn {
  display: inline-flex;
  align-items: center;

  border: none;
  border-radius: 6px;
  padding: 0.75rem 1em;
  cursor: pointer;

  background-color: var(--default);
  color: white;
  text-decoration: none;

  font-weight: 700;
  font-size: 1rem;
  line-height: 1.5rem;
  white-space: pre;
}
.btn:hover {
  background-color: var(--hover);
}
.btn:active {
  background-color: var(--active);
}

a {
  color: #0066cc;
  text-decoration: underline;
}

img {
  height: 1.5rem;
}
</style>
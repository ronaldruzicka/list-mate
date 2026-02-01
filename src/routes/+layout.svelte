<script lang="ts">
  import './layout.css';
  import favicon from '$lib/assets/favicon.svg';
  import { authClient } from '$lib/auth-client';
  import { Button } from '$lib/components/ui/button';
  import { goto } from '$app/navigation';

  const session = authClient.useSession();
  let { children } = $props();

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          goto('/auth');
        },
      },
    });
  }
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>List Mate - Your Shopping Assistant</title>
</svelte:head>

<div class="min-h-screen bg-background text-foreground">
  <header class="border-b bg-card">
    <div class="container mx-auto flex h-16 items-center justify-between px-4">
      <a href="/" class="text-xl font-bold tracking-tight">List Mate</a>

      <div class="flex items-center gap-4">
        {#if $session.data}
          <div class="hidden text-sm text-muted-foreground md:block">
            {$session.data.user.email}
          </div>
          <Button variant="ghost" size="sm" onclick={handleSignOut}>Sign Out</Button>
        {:else}
          <Button variant="ghost" size="sm" href="/auth">Sign In</Button>
        {/if}
      </div>
    </div>
  </header>

  <main>
    {@render children()}
  </main>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: 'Inter Variable', sans-serif;
  }
</style>

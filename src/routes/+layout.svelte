<script lang="ts">
  import './layout.css';
  import favicon from '$lib/assets/favicon.svg';
  import { authClient } from '$lib/auth-client';
  import { Button } from '$lib/components/ui/button';
  import { goto } from '$app/navigation';
  import { Toaster } from '$lib/components/ui/sonner';
  import { appState } from '$lib/state.svelte';

  const session = authClient.useSession();
  let { children } = $props();

  const showHeader = $derived($session.data || appState.isGuestMode);

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

<div class="app-layout dark bg-background text-foreground" class:no-header={!showHeader}>
  {#if showHeader}
    <header
      class="app-header border-t md:border-t-0 md:border-b bg-background/80 backdrop-blur-lg z-50"
    >
      <div class="container mx-auto flex h-16 items-center justify-between px-4">
        <a href="/" class="text-xl font-bold tracking-tight md:block hidden">List Mate</a>

        <div class="flex flex-1 items-center justify-end gap-4">
          <div class="flex items-center gap-4">
            {#if $session.data}
              <div class="hidden text-sm text-muted-foreground lg:block">
                {$session.data.user.email}
              </div>
              <Button variant="ghost" size="sm" onclick={handleSignOut}>Sign Out</Button>
            {:else}
              <Button variant="ghost" size="sm" href="/auth">Sign In</Button>
            {/if}
          </div>
        </div>
      </div>
    </header>
  {/if}

  <main class="app-main">
    {@render children()}
  </main>
</div>

<Toaster />

<style>
  :global(body) {
    margin: 0;
    font-family: 'Inter Variable', sans-serif;
    overflow: hidden;
  }
</style>

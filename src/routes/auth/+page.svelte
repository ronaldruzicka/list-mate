<script lang="ts">
  import { authClient } from '$lib/auth-client';
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';

  let email = $state('');
  let password = $state('');
  let name = $state('');
  let isLogin = $state(true);
  let isLoading = $state(false);
  let error = $state<string | null>(null);

  async function handleSubmit() {
    isLoading = true;
    error = null;

    try {
      if (isLogin) {
        const { error: authError } = await authClient.signIn.email({
          email,
          password,
          callbackURL: '/',
        });
        if (authError) {
          error = authError.message || 'Failed to sign in';
        }
      } else {
        const { error: authError } = await authClient.signUp.email({
          email,
          password,
          name,
          callbackURL: '/',
        });
        if (authError) {
          error = authError.message || 'Failed to sign up';
        }
      }
    } catch (e: any) {
      error = e.message || 'An unexpected error occurred';
    } finally {
      isLoading = false;
    }
  }
</script>

<div
  class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8"
>
  <Card.Root class="w-full max-w-md">
    <Card.Header>
      <Card.Title class="text-center text-2xl font-bold">
        {isLogin ? 'Sign in to your account' : 'Create a new account'}
      </Card.Title>
      <Card.Description class="text-center">
        {isLogin ? "Don't have an account?" : 'Already have an account?'}
        <button
          class="font-medium text-primary hover:underline"
          onclick={() => (isLogin = !isLogin)}
        >
          {isLogin ? 'Sign up' : 'Sign in'}
        </button>
      </Card.Description>
    </Card.Header>
    <Card.Content>
      <form
        onsubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        class="space-y-4"
      >
        {#if !isLogin}
          <div class="space-y-2">
            <Label for="name">Name</Label>
            <Input id="name" type="text" placeholder="John Doe" bind:value={name} required />
          </div>
        {/if}
        <div class="space-y-2">
          <Label for="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            bind:value={email}
            required
          />
        </div>
        <div class="space-y-2">
          <Label for="password">Password</Label>
          <Input id="password" type="password" bind:value={password} required />
        </div>

        {#if error}
          <p class="text-sm font-medium text-destructive">{error}</p>
        {/if}

        <Button type="submit" class="w-full" disabled={isLoading}>
          {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
        </Button>
      </form>
    </Card.Content>
  </Card.Root>
</div>

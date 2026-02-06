<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import { superForm, defaults } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { signInSchema, signUpSchema } from './schema';
	import { toast } from 'svelte-sonner';

	let isLogin = $state(true);
	let isLoading = $state(false);
	let authError = $state<string | null>(null);

	const signInForm = superForm(defaults(zod4(signInSchema)), {
		SPA: true,
		validators: zod4(signInSchema),
		async onUpdate({ form }) {
			if (!form.valid) return;
			isLoading = true;
			authError = null;

			try {
				const { error } = await authClient.signIn.email({
					email: form.data.email,
					password: form.data.password,
					callbackURL: '/',
				});

				if (error) {
					const message = error.message || 'Failed to sign in';
					authError = message;
					toast.error(message);
				} else {
					toast.success('Successfully signed in!');
				}
			} catch (e: any) {
				const message = e.message || 'An unexpected error occurred';
				authError = message;
				toast.error(message);
			} finally {
				isLoading = false;
			}
		},
	});

	const signUpForm = superForm(defaults(zod4(signUpSchema)), {
		SPA: true,
		validators: zod4(signUpSchema),
		async onUpdate({ form }) {
			if (!form.valid) return;
			isLoading = true;
			authError = null;

			try {
				const { error } = await authClient.signUp.email({
					email: form.data.email,
					password: form.data.password,
					name: form.data.name,
					callbackURL: '/',
				});

				if (error) {
					const message = error.message || 'Failed to sign up';
					authError = message;
					toast.error(message);
				} else {
					toast.success('Account created successfully!');
				}
			} catch (e: any) {
				const message = e.message || 'An unexpected error occurred';
				authError = message;
				toast.error(message);
			} finally {
				isLoading = false;
			}
		},
	});

	const { form: signInData, enhance: signInEnhance, errors: signInErrors } = signInForm;
	const { form: signUpData, enhance: signUpEnhance, errors: signUpErrors } = signUpForm;
</script>

<div
	class="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-900"
>
	<Card.Root class="w-full max-w-md">
		<Card.Header>
			<Card.Title class="text-center text-2xl font-bold">
				{isLogin ? 'Sign in to your account' : 'Create a new account'}
			</Card.Title>
			<Card.Description class="text-center">
				{isLogin ? "Don't have an account?" : 'Already have an account?'}
				<button
					class="text-primary font-medium hover:underline"
					onclick={() => (isLogin = !isLogin)}
				>
					{isLogin ? 'Sign up' : 'Sign in'}
				</button>
			</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if isLogin}
				<form method="POST" use:signInEnhance class="space-y-4">
					<Form.Field form={signInForm} name="email">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Email</Form.Label>
								<Input
									{...props}
									type="email"
									placeholder="name@example.com"
									bind:value={$signInData.email}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field form={signInForm} name="password">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Password</Form.Label>
								<Input {...props} type="password" bind:value={$signInData.password} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					{#if authError}
						<p class="text-destructive text-sm font-medium">{authError}</p>
					{/if}

					<Button type="submit" class="w-full" disabled={isLoading}>
						{isLoading ? 'Processing...' : 'Sign In'}
					</Button>
				</form>
			{:else}
				<form method="POST" use:signUpEnhance class="space-y-4">
					<Form.Field form={signUpForm} name="name">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Name</Form.Label>
								<Input
									{...props}
									type="text"
									placeholder="John Doe"
									bind:value={$signUpData.name}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field form={signUpForm} name="email">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Email</Form.Label>
								<Input
									{...props}
									type="email"
									placeholder="name@example.com"
									bind:value={$signUpData.email}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field form={signUpForm} name="password">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Password</Form.Label>
								<Input {...props} type="password" bind:value={$signUpData.password} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					{#if authError}
						<p class="text-destructive text-sm font-medium">{authError}</p>
					{/if}

					<Button type="submit" class="w-full" disabled={isLoading}>
						{isLoading ? 'Processing...' : 'Sign Up'}
					</Button>
				</form>
			{/if}
		</Card.Content>
	</Card.Root>
</div>

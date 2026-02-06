<script lang="ts">
	import { goto } from '$app/navigation';
	import favicon from '$lib/assets/favicon.svg';
	import { authClient } from '$lib/auth-client';
	import { Toaster } from '$lib/components/ui/sonner';
	import { onMount } from 'svelte';
	import './layout.css';

	let { children } = $props();

	onMount(() => {
		const session = authClient.useSession();

		if (session.value?.data?.session) {
			goto('/lists');
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>List Mate - Your Shopping Assistant</title>
</svelte:head>

<main class="dark bg-background text-foreground flex h-dvh flex-col items-center">
	<div class="flex h-full max-h-full w-full max-w-md flex-col p-6">{@render children()}</div>
</main>

<Toaster />

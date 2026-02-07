<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import CreateListDialog from '$lib/components/create-list-dialog.svelte';
	import { Button } from '$lib/components/ui/button';

	const session = authClient.useSession();

	let createListDialog: CreateListDialog;

	function handleCreateList() {
		createListDialog?.show();
	}

	async function handleCreateListSubmit(data: { name: string }) {
		// TODO: Call the API
		console.log(data.name);
	}
</script>

<svelte:head>
	<title>List Mate</title>
	<meta
		name="description"
		content="Your smart shopping list companion. Keep track of your groceries with ease."
	/>
</svelte:head>

<div class="flex h-full flex-col justify-center">
	<div class="flex flex-col items-center gap-12 text-center">
		<div class="flex flex-col items-center gap-8">
			<div
				class="bg-primary shadow-primary/30 animate-float flex h-24 w-24 rotate-3 items-center justify-center rounded-3xl shadow-2xl"
			>
				<span class="text-5xl">🛍️</span>
			</div>
			<h2 class="text-4xl font-extrabold tracking-tight sm:text-5xl">
				List Mate
				<span
					class="from-primary block bg-linear-to-r to-emerald-500 bg-clip-text text-transparent"
				>
					Shopping made easy.
				</span>
			</h2>
			<p class="text-muted-foreground text-lg leading-relaxed">
				Streamline your grocery runs with a smart, beautiful shopping list tailored for you.
			</p>
		</div>

		<div class="flex w-full flex-col gap-4">
			<Button size="xl" onclick={handleCreateList}>Create new list</Button>

			{#if !session.value?.data?.session}
				<Button
					variant="outline"
					size="lg"
					href="/auth"
					class="h-16 rounded-2xl border-white/10 text-lg font-semibold hover:bg-white/5"
				>
					Sign in to sync & share
				</Button>

				<p class="text-muted-foreground text-sm">
					Sign up if you want the ability to share a list with someone else.
				</p>
			{:else}
				<Button variant="outline" size="xl" href="/share">Share</Button>
			{/if}
		</div>
	</div>
</div>

<CreateListDialog bind:this={createListDialog} onSubmit={handleCreateListSubmit} />

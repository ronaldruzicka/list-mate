<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import './layout.css';

	let { children } = $props();
</script>

<main class="dark bg-background text-foreground flex h-dvh flex-col items-center">
	<div class="flex h-full max-h-full w-full max-w-md flex-col p-6">{@render children()}</div>
</main>

<Toaster />

<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Plus } from '@lucide/svelte';

	type Props = {
		onClick?: () => void;
	};

	let { onClick }: Props = $props();
</script>

<div
	class="add-item-wrapper from-background via-background/95 fixed right-0 bottom-0 left-0 z-30 bg-linear-to-t to-transparent"
>
	<div class="mx-auto max-w-lg px-6 pt-4 pb-6">
		<Button
			class="add-item-button bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/25 hover:shadow-primary/30 w-full rounded-2xl py-6 text-base font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
			onclick={onClick}
		>
			<Plus class="mr-2 h-5 w-5" />
			Add new item
		</Button>
	</div>
</div>

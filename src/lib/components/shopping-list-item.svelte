<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import type { Category } from '$lib/constants';
	import { EllipsisVertical } from '@lucide/svelte';

	type Props = {
		id: string;
		name: string;
		checked?: boolean;
		quantity?: string;
		category: Category;
		onToggle?: (id: string, checked: boolean) => void;
		onMenuClick?: (id: string) => void;
	};

	let { id, name, checked = false, quantity, category, onToggle, onMenuClick }: Props = $props();

	function handleToggle(event: MouseEvent | KeyboardEvent) {
		// Handle accessibility: Enter or Space for keyboard users
		if (event instanceof KeyboardEvent && event.key !== 'Enter' && event.key !== ' ') {
			return;
		}

		onToggle?.(id, !checked);
	}

	function handleMenuClick(event: MouseEvent) {
		event.stopPropagation();
		onMenuClick?.(id);
	}
</script>

<div
	role="button"
	tabindex="0"
	onclick={handleToggle}
	onkeydown={handleToggle}
	class="shopping-list-item group hover:bg-card/50 after:from-border relative flex cursor-pointer items-center gap-4 rounded-xl px-2 py-4 transition-all
		duration-200 after:absolute after:right-0 after:bottom-0 after:left-14 after:h-px after:bg-linear-to-r after:to-transparent
  "
>
	<div class="checkbox-wrapper pointer-events-none relative flex items-center justify-center">
		<Checkbox
			id="item-{id}"
			{checked}
			class="data-[state=checked]:bg-primary data-[state=checked]:border-primary h-6 w-6 rounded-full border-2 transition-all duration-300"
		/>
		{#if checked}
			<div
				class="bg-primary/20 pointer-events-none absolute inset-0 animate-ping rounded-full"
				style="animation-iteration-count: 1;"
			></div>
		{/if}
	</div>

	<div
		class="flex-1 text-base font-medium transition-all duration-200 select-none {checked
			? 'text-muted-foreground line-through'
			: 'text-foreground'}"
	>
		<div class="flex flex-col gap-0.5">
			<div class="flex items-center gap-2">
				<span class="item-name">{name}</span>
				{#if quantity}
					<span class="text-muted-foreground text-sm">({quantity})</span>
				{/if}
			</div>
		</div>
	</div>

	<button
		type="button"
		class="hover:bg-accent focus:ring-ring rounded-lg p-2 transition-all duration-200 group-hover:opacity-100 focus:opacity-100 focus:ring-2 focus:outline-none"
		onclick={handleMenuClick}
		aria-label="Item options"
	>
		<EllipsisVertical class="text-muted-foreground h-5 w-5" />
	</button>
</div>

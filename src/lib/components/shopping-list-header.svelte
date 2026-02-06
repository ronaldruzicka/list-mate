<script lang="ts">
	import { ChevronLeft } from '@lucide/svelte';
	import LinkBtn from './link-btn.svelte';
	import Badge from './ui/badge/badge.svelte';

	type Props = {
		title?: string;
		itemCount?: number;
		lastModified?: Date | string;
		onBack?: () => void;
	};

	let { title = 'Shopping list', itemCount = 0, lastModified, onBack }: Props = $props();

	const locale = globalThis.Intl.DateTimeFormat().resolvedOptions().locale;

	function formatDate(date: Date | string | undefined): string {
		if (!date) {
			return '';
		}
		const formattedDate = typeof date === 'string' ? new Date(date) : date;

		if (isNaN(formattedDate.getTime())) {
			return '';
		}

		return formattedDate.toLocaleString(locale ?? 'en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	}
</script>

<header class="flex gap-2">
	<LinkBtn class="flex-none" href="/lists" size="icon" variant="ghost">
		<ChevronLeft class="size-6" />
	</LinkBtn>

	<div class="flex flex-1 flex-col gap-1">
		<h1 class="flex items-center gap-2 text-2xl font-bold tracking-tight">
			{title}
			<!-- <span class="text-muted-foreground font-normal">({itemCount})</span> -->
			<Badge class="flex-none" variant="default">{itemCount}</Badge>
		</h1>

		{#if lastModified}
			<p class="text-muted-foreground text-xs">
				Last modified {formatDate(lastModified)}
			</p>
		{/if}
	</div>
</header>

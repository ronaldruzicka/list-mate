<script lang="ts">
	import type { Snippet } from 'svelte';
	import { buttonVariants, type ButtonProps } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	type Props = {
		href: string;
		children: Snippet;
		variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
	} & ButtonProps;

	let { href, children, class: className, ...buttonProps }: Props = $props();
</script>

<a
	{href}
	class={cn(buttonVariants({ size: buttonProps.size, variant: buttonProps.variant }), className)}
	{...buttonProps}>{@render children?.()}</a
>

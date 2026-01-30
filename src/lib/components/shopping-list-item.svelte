<script lang="ts">
  import { Checkbox } from '$lib/components/ui/checkbox/index.js';
  import { EllipsisVertical } from '@lucide/svelte';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import type { Category } from '$lib/constants';

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
    // Only toggle if we didn't click the menu button
    const target = event.target as HTMLElement;
    if (target.closest('.menu-button')) {
      return;
    }

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

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
  role="button"
  tabindex="0"
  onclick={handleToggle}
  onkeydown={handleToggle}
  class="shopping-list-item group flex items-center gap-4 py-4 px-2 hover:bg-card/50 rounded-xl transition-all duration-200 cursor-pointer"
>
  <div class="checkbox-wrapper relative flex items-center justify-center pointer-events-none">
    <Checkbox
      id="item-{id}"
      {checked}
      class="h-6 w-6 rounded-full border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all duration-300"
    />
    {#if checked}
      <div
        class="absolute inset-0 rounded-full bg-primary/20 animate-ping pointer-events-none"
        style="animation-iteration-count: 1;"
      ></div>
    {/if}
  </div>

  <div
    class="flex-1 select-none text-base font-medium transition-all duration-200 {checked
      ? 'text-muted-foreground line-through'
      : 'text-foreground'}"
  >
    <div class="flex flex-col gap-0.5">
      <div class="flex items-center gap-2">
        <span class="item-name">{name}</span>
        {#if quantity}
          <span class="text-sm text-muted-foreground">({quantity})</span>
        {/if}
      </div>
    </div>
  </div>

  <button
    type="button"
    class="menu-button p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-accent transition-all duration-200 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
    onclick={handleMenuClick}
    aria-label="Item options"
  >
    <EllipsisVertical class="h-5 w-5 text-muted-foreground" />
  </button>
</div>

<style>
  .shopping-list-item {
    position: relative;
  }

  .shopping-list-item::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 3.5rem;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, var(--border), transparent);
  }

  @media (hover: none) {
    .menu-button {
      opacity: 1;
    }
  }
</style>

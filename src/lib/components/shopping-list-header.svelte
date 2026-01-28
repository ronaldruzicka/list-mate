<script lang="ts">
  import { ChevronLeft } from '@lucide/svelte';

  type Props = {
    title?: string;
    itemCount?: number;
    lastModified?: Date | string;
    onBack?: () => void;
  };

  let { title = 'Shopping list', itemCount = 0, lastModified, onBack }: Props = $props();

  function formatDate(date: Date | string | undefined): string {
    if (!date) {
      return '';
    }
    const formattedDate = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(formattedDate.getTime())) {
      return '';
    }

    return formattedDate.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
</script>

<header class="shopping-list-header py-4 px-2">
  <div class="flex items-center gap-3 mb-3">
    <button
      type="button"
      class="back-button p-2 -ml-2 rounded-xl hover:bg-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
      onclick={onBack}
      aria-label="Go back"
    >
      <ChevronLeft class="h-6 w-6" />
    </button>
    <div class="flex-1">
      <h1 class="text-2xl font-bold tracking-tight">
        {title}
        <span class="text-muted-foreground font-normal">({itemCount})</span>
      </h1>
    </div>
  </div>

  {#if lastModified}
    <p class="last-modified text-sm text-muted-foreground ml-10">
      Last modified {formatDate(lastModified)}
    </p>
  {/if}
</header>

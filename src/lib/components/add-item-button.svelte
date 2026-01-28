<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import { Plus } from '@lucide/svelte';

  type Props = {
    onClick?: () => void;
  };

  let { onClick }: Props = $props();
</script>

<div
  class="add-item-wrapper fixed bottom-0 left-0 right-0 bg-linear-to-t from-background via-background/95 to-transparent"
>
  <div class="max-w-lg mx-auto px-6 pb-6 pt-4">
    <Button
      class="add-item-button w-full py-6 text-base font-semibold rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
      onclick={onClick}
    >
      <Plus class="h-5 w-5 mr-2" />
      Add new item
    </Button>
  </div>
</div>

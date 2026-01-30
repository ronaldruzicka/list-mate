<script lang="ts">
  import ShoppingListHeader from '$components/shopping-list-header.svelte';
  import ShoppingListItem from '$components/shopping-list-item.svelte';
  import AddItemButton from '$components/add-item-button.svelte';
  import { flip } from 'svelte/animate';
  import { quintOut } from 'svelte/easing';
  import { crossfade, slide } from 'svelte/transition';

  const [send, receive] = crossfade({
    duration: (d) => Math.sqrt(d * 200),

    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === 'none' ? '' : style.transform;

      return {
        duration: 400,
        easing: quintOut,
        css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`,
      };
    },
  });

  type ShoppingItem = {
    id: string;
    name: string;
    checked: boolean;
    quantity?: string;
  };

  let items = $state<ShoppingItem[]>([
    { id: '1', name: 'Milk', checked: true, quantity: '2 liters' },
    { id: '2', name: 'Eggs', checked: true, quantity: '12 pcs' },
    { id: '3', name: 'Bread', checked: false, quantity: '1 loaf' },
    { id: '4', name: 'Butter', checked: false, quantity: '250g' },
    { id: '5', name: 'Cheese', checked: false, quantity: '200g' },
    { id: '6', name: 'Tomatoes', checked: true, quantity: '500g' },
    { id: '7', name: 'Onions', checked: false, quantity: '1 kg' },
    { id: '8', name: 'Garlic', checked: false, quantity: '3 heads' },
    { id: '9', name: 'Olive Oil', checked: true },
    { id: '10', name: 'Pasta', checked: false, quantity: '500g' },
    { id: '11', name: 'Chicken Breast', checked: false, quantity: '500g' },
    { id: '12', name: 'Apples', checked: false, quantity: '1 kg' },
    { id: '13', name: 'Bananas', checked: true, quantity: '1 bunch' },
    { id: '14', name: 'Yogurt', checked: false, quantity: '4 packs' },
    { id: '15', name: 'Coffee Beans', checked: false, quantity: '250g' },
    { id: '16', name: 'Toilet Paper', checked: true, quantity: '8 rolls' },
    { id: '17', name: 'Dish Soap', checked: false, quantity: '1 bottle' },
    { id: '18', name: 'Rice', checked: false, quantity: '1 kg' },
    { id: '19', name: 'Spinach', checked: true, quantity: '100g' },
    { id: '20', name: 'Lemons', checked: false, quantity: '3 pcs' },
  ]);

  let lastModified = $state(new Date());

  let uncompletedItems = $derived.by(() => {
    return items.filter((item) => {
      return !item.checked;
    });
  });

  let completedItems = $derived.by(() => {
    return items.filter((item) => {
      return item.checked;
    });
  });

  function handleToggle(id: string, checked: boolean) {
    const index = items.findIndex((item) => {
      return item.id === id;
    });

    if (index !== -1) {
      items = items.with(index, { ...items[index], checked });
      lastModified = new Date();
    }
  }

  function handleMenuClick(id: string) {
    // TODO: Implement menu actions (edit, delete)
    console.log('Menu clicked for item:', id);
  }

  function handleAddItem() {
    const newId = crypto.randomUUID();

    items = [
      ...items,
      {
        id: newId,
        name: 'New Item',
        checked: false,
      },
    ];

    lastModified = new Date();
  }

  function handleBack() {
    console.log('Back button clicked');
  }
</script>

<svelte:head>
  <title>Shopping List | ListMate</title>
  <meta
    name="description"
    content="Your smart shopping list companion. Keep track of your groceries with ease."
  />
</svelte:head>

<div
  class="shopping-list-page dark h-dvh flex flex-col bg-background text-foreground overflow-hidden"
>
  <div class="max-w-lg mx-auto w-full flex flex-col h-full bg-background relative">
    <!-- Header: Sticky/Fixed at top -->
    <div class="px-6 flex-none bg-background/80 backdrop-blur-xl z-20 border-b border-white/5">
      <ShoppingListHeader
        title="Shopping list"
        itemCount={items.length}
        {lastModified}
        onBack={handleBack}
      />
    </div>

    <!-- Items List: Scrollable -->
    <div class="items-list flex-1 overflow-y-auto px-6 pb-32 pt-2 scroll-smooth">
      {#each uncompletedItems as item (item.id)}
        <div
          in:receive={{ key: item.id }}
          out:send={{ key: item.id }}
          animate:flip={{ duration: 400 }}
        >
          <ShoppingListItem
            id={item.id}
            name={item.name}
            checked={item.checked}
            quantity={item.quantity}
            onToggle={handleToggle}
            onMenuClick={handleMenuClick}
          />
        </div>
      {/each}

      {#if completedItems.length > 0}
        {#if uncompletedItems.length > 0}
          <div
            class="separator-container py-6"
            transition:slide={{ duration: 300, easing: quintOut }}
          >
            <div class="separator"></div>
            <span class="separator-text">Completed</span>
          </div>
        {/if}

        {#each completedItems as item (item.id)}
          <div
            class="completed-item"
            in:receive={{ key: item.id }}
            out:send={{ key: item.id }}
            animate:flip={{ duration: 400 }}
          >
            <ShoppingListItem
              id={item.id}
              name={item.name}
              checked={item.checked}
              quantity={item.quantity}
              onToggle={handleToggle}
              onMenuClick={handleMenuClick}
            />
          </div>
        {/each}
      {/if}

      {#if items.length === 0}
        <div class="empty-state flex flex-col items-center justify-center py-16 text-center">
          <div
            class="empty-icon w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4"
          >
            <span class="text-3xl">🛒</span>
          </div>
          <h3 class="text-lg font-medium text-foreground mb-2">No items found</h3>
          <p class="text-sm text-muted-foreground">Your shopping list is empty. Add some items!</p>
        </div>
      {/if}
    </div>
  </div>

  <!-- Floating Add Button -->
  <AddItemButton onClick={handleAddItem} />
</div>

<style>
  .completed-item {
    opacity: 0.7;
    transition: opacity 0.2s ease;
  }

  .completed-item:hover {
    opacity: 1;
  }

  .separator-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .separator {
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  }

  .separator-text {
    position: relative;
    background-color: var(--background);
    padding: 0 12px;
    color: var(--muted-foreground);
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .items-list::-webkit-scrollbar {
    width: 6px;
  }

  .items-list::-webkit-scrollbar-track {
    background: transparent;
  }

  .items-list::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }

  .items-list::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .empty-state {
    animation: fadeIn 0.4s ease-out forwards;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>

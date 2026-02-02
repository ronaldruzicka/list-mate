<script lang="ts">
  import ShoppingListHeader from '$components/shopping-list-header.svelte';
  import ShoppingListItem from '$components/shopping-list-item.svelte';
  import AddItemButton from '$components/add-item-button.svelte';
  import { flip } from 'svelte/animate';
  import { quintOut } from 'svelte/easing';
  import { crossfade, slide } from 'svelte/transition';
  import { authClient } from '$lib/auth-client';
  import { Button } from '$lib/components/ui/button';
  import { appState } from '$lib/state.svelte';

  const session = authClient.useSession();
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

  import { DEFAULT_CATEGORIES } from '$lib/constants';

  type ShoppingItem = {
    id: string;
    name: string;
    checked: boolean;
    quantity?: string;
    categoryId?: string;
  };

  const getCategory = (id?: string) => {
    return DEFAULT_CATEGORIES.find((c) => c.id === id);
  };

  let items = $state<ShoppingItem[]>([
    { id: '1', name: 'Milk', checked: true, quantity: '2 liters', categoryId: 'dairy-and-eggs' },
    { id: '2', name: 'Eggs', checked: true, quantity: '12 pcs', categoryId: 'dairy-and-eggs' },
    { id: '3', name: 'Bread', checked: false, quantity: '1 loaf', categoryId: 'bakery' },
    { id: '4', name: 'Butter', checked: false, quantity: '250g', categoryId: 'dairy-and-eggs' },
    { id: '5', name: 'Cheese', checked: false, quantity: '200g', categoryId: 'dairy-and-eggs' },
    {
      id: '6',
      name: 'Tomatoes',
      checked: true,
      quantity: '500g',
      categoryId: 'fruit-and-vegetables',
    },
    {
      id: '7',
      name: 'Onions',
      checked: false,
      quantity: '1 kg',
      categoryId: 'fruit-and-vegetables',
    },
    {
      id: '8',
      name: 'Garlic',
      checked: false,
      quantity: '3 heads',
      categoryId: 'fruit-and-vegetables',
    },
    { id: '9', name: 'Olive Oil', checked: true, categoryId: 'cans-and-jars' },
    { id: '10', name: 'Pasta', checked: false, quantity: '500g', categoryId: 'cans-and-jars' },
    { id: '11', name: 'Chicken Breast', checked: false, quantity: '500g', categoryId: 'meat' },
    {
      id: '12',
      name: 'Apples',
      checked: false,
      quantity: '1 kg',
      categoryId: 'fruit-and-vegetables',
    },
    {
      id: '13',
      name: 'Bananas',
      checked: true,
      quantity: '1 bunch',
      categoryId: 'fruit-and-vegetables',
    },
    { id: '14', name: 'Yogurt', checked: false, quantity: '4 packs', categoryId: 'dairy-and-eggs' },
    { id: '15', name: 'Coffee Beans', checked: false, quantity: '250g', categoryId: 'beverages' },
    {
      id: '16',
      name: 'Toilet Paper',
      checked: true,
      quantity: '8 rolls',
      categoryId: 'personal-care',
    },
    {
      id: '17',
      name: 'Dish Soap',
      checked: false,
      quantity: '1 bottle',
      categoryId: 'cleaning-and-laundry',
    },
    { id: '18', name: 'Rice', checked: false, quantity: '1 kg', categoryId: 'cans-and-jars' },
    {
      id: '19',
      name: 'Spinach',
      checked: true,
      quantity: '100g',
      categoryId: 'fruit-and-vegetables',
    },
    {
      id: '20',
      name: 'Lemons',
      checked: false,
      quantity: '3 pcs',
      categoryId: 'fruit-and-vegetables',
    },
  ]);

  let lastModified = $state(new Date());
  let isGuestMode = $state(false);

  let uncompletedGrouped = $derived.by(() => {
    const groups: Record<string, ShoppingItem[]> = {};

    items
      .filter((item) => !item.checked)
      .forEach((item) => {
        const cid = item.categoryId || 'other';
        if (!groups[cid]) {
          groups[cid] = [];
        }
        groups[cid].push(item);
      });

    return Object.entries(groups)
      .map(([cid, groupItems]) => ({
        category: getCategory(cid) || getCategory('other')!,
        items: groupItems,
      }))
      .toSorted((a, b) => a.category.sortOrder - b.category.sortOrder);
  });

  let completedGrouped = $derived.by(() => {
    const groups: Record<string, ShoppingItem[]> = {};

    items
      .filter((item) => item.checked)
      .forEach((item) => {
        const cid = item.categoryId || 'other';
        if (!groups[cid]) {
          groups[cid] = [];
        }
        groups[cid].push(item);
      });

    return Object.entries(groups)
      .map(([cid, groupItems]) => ({
        category: getCategory(cid) || getCategory('other')!,
        items: groupItems,
      }))
      .toSorted((a, b) => a.category.sortOrder - b.category.sortOrder);
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
        categoryId: 'other',
      },
    ];

    lastModified = new Date();
  }

  function handleBack() {
    console.log('Back button clicked');
    if (appState.isGuestMode) {
      appState.setGuestMode(false);
    }
  }

  function handleCreateList() {
    appState.setGuestMode(true);
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
  class="shopping-list-page dark h-full flex flex-col bg-background text-foreground overflow-hidden"
>
  <div class="max-w-lg mx-auto w-full flex flex-col h-full bg-background relative">
    {#if $session.data || appState.isGuestMode}
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
      <div class="items-list flex-1 overflow-y-auto px-6 pb-32 scroll-smooth pt-0">
        {#each uncompletedGrouped as group (group.category.id)}
          <div class="category-group mb-4">
            <div
              class="category-header sticky top-0 bg-background z-10 pt-3 pb-2 mb-1 flex items-center gap-2"
            >
              <span class="text-sm">{group.category.icon}</span>
              <span
                class="text-xs font-bold uppercase tracking-wider"
                style="color: {group.category.color}"
              >
                {group.category.name}
              </span>
            </div>

            <div class="category-items space-y-1">
              {#each group.items as item (item.id)}
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
                    category={group.category}
                    onToggle={handleToggle}
                    onMenuClick={handleMenuClick}
                  />
                </div>
              {/each}
            </div>
          </div>
        {/each}

        {#if completedGrouped.length > 0}
          <div
            class="separator-container py-6"
            transition:slide={{ duration: 300, easing: quintOut }}
          >
            <div class="separator"></div>
            <span class="separator-text">Completed</span>
          </div>

          {#each completedGrouped as group (group.category.id)}
            <div class="category-group mb-4 opacity-60 grayscale-[0.5]">
              <div class="category-header flex items-center gap-2 py-2 mb-1 bg-background">
                <span class="text-sm">{group.category.icon}</span>
                <span class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.category.name}
                </span>
              </div>

              <div class="category-items space-y-1">
                {#each group.items as item (item.id)}
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
                      category={group.category}
                      onToggle={handleToggle}
                      onMenuClick={handleMenuClick}
                    />
                  </div>
                {/each}
              </div>
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
            <p class="text-sm text-muted-foreground">
              Your shopping list is empty. Add some items!
            </p>
          </div>
        {/if}
      </div>

      <!-- Floating Add Button -->
      <AddItemButton onClick={handleAddItem} />
    {:else}
      <!-- Premium Landing Page Section -->
      <div class="flex flex-1 flex-col items-center justify-center">
        <section class="hero-section relative overflow-hidden px-6 py-12 text-center w-full">
          <div class="relative z-10 mx-auto max-w-md">
            <div
              class="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary shadow-2xl shadow-primary/30 rotate-3 animate-float"
            >
              <span class="text-5xl">🛍️</span>
            </div>
            <h2 class="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
              List Mate
              <span
                class="block bg-linear-to-r from-primary to-emerald-500 bg-clip-text text-transparent"
              >
                Shopping made easy.
              </span>
            </h2>
            <p class="mb-12 text-lg leading-relaxed text-muted-foreground">
              Streamline your grocery runs with a smart, beautiful shopping list tailored for you.
            </p>

            <div class="flex flex-col gap-4">
              <Button
                size="lg"
                onclick={handleCreateList}
                class="h-16 rounded-2xl text-xl font-bold"
              >
                Create new list
              </Button>
              <Button
                variant="outline"
                size="lg"
                href="/auth"
                class="h-16 rounded-2xl text-lg font-semibold border-white/10 hover:bg-white/5"
              >
                Sign in to sync & share
              </Button>
            </div>

            <p class="mt-8 text-sm text-muted-foreground">
              Sign up if you want the ability to share a list with someone else.
            </p>
          </div>

          <!-- Decorative blobs -->
          <div
            class="absolute top-0 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-primary/20 blur-3xl opacity-30"
          ></div>
        </section>
      </div>
    {/if}
  </div>
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

  @keyframes float {
    0%,
    100% {
      transform: translateY(0) rotate(3deg);
    }
    50% {
      transform: translateY(-10px) rotate(5deg);
    }
  }

  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
</style>

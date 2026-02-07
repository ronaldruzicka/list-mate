<script lang="ts">
	import AddItemButton from '$components/add-item-button.svelte';
	import ShoppingListHeader from '$components/shopping-list-header.svelte';
	import ShoppingListItem from '$components/shopping-list-item.svelte';
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
</script>

<svelte:head>
	<title>Shopping List | ListMate</title>
	<meta
		name="description"
		content="Your smart shopping list companion. Keep track of your groceries with ease."
	/>
</svelte:head>

<!-- Header: Sticky/Fixed at top -->
<ShoppingListHeader title="Shopping list" itemCount={items.length} {lastModified} />

{#if items.length === 0}
	<div class="empty-state flex flex-col items-center justify-center py-16 text-center">
		<div class="empty-icon bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
			<span class="text-3xl">🛒</span>
		</div>
		<h3 class="text-foreground mb-2 text-lg font-medium">No items found</h3>
		<p class="text-muted-foreground text-sm">Your shopping list is empty. Add some items!</p>
	</div>
{/if}

<!-- Items List: Scrollable -->
<div class="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto scroll-smooth">
	{#each uncompletedGrouped as group (group.category.id)}
		<div class="category-group">
			<div
				class="category-header bg-background sticky top-0 z-10 flex items-center gap-2 pt-3 pb-2"
			>
				<span class="text-sm">{group.category.icon}</span>
				<span
					class="text-xs font-bold tracking-wider uppercase"
					style="color: {group.category.color}"
				>
					{group.category.name}
				</span>
			</div>

			<div class="category-items">
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
			class="relative flex items-center justify-center py-6"
			transition:slide={{ duration: 300, easing: quintOut }}
		>
			<div
				class="to-foreground/20 absolute right-0 left-0 h-px bg-linear-to-b from-transparent"
			></div>
			<span
				class="bg-background text-muted-foreground relative px-4 text-xs font-semibold tracking-wider uppercase"
				>Completed</span
			>
		</div>

		{#each completedGrouped as group (group.category.id)}
			<div class="category-group mb-4 opacity-60 grayscale-[0.5]">
				<div class="category-header bg-background mb-1 flex items-center gap-2 py-2">
					<span class="text-sm">{group.category.icon}</span>
					<span class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
						{group.category.name}
					</span>
				</div>

				<div class="category-items space-y-1">
					{#each group.items as item (item.id)}
						<div
							class="completed-item opacity-70 transition-opacity duration-200 ease-in-out hover:opacity-100"
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
</div>

<!-- Floating Add Button -->
<AddItemButton onClick={handleAddItem} />

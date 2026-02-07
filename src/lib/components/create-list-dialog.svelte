<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';

	const formSchema = z.object({
		name: z.string().trim().min(1, 'Name is required'),
	});

	type Props = {
		onSubmit: (data: z.infer<typeof formSchema>) => Promise<void>;
	};

	let { onSubmit }: Props = $props();

	let dialog: HTMLDialogElement;

	const form = superForm(defaults({ name: '' }, zod4(formSchema)), {
		SPA: true,
		validators: zod4(formSchema),
		onUpdate: async ({ form }) => {
			if (form.valid) {
				try {
					await onSubmit(form.data);
					dialog.close();
				} catch (error) {
					dialog.close();
					toast.error('Failed to create list');
				}
			}
		},
	});

	const { form: formData, enhance } = form;

	export function show() {
		dialog.showModal();
	}

	export function close() {
		dialog.close();
	}
</script>

<dialog
	bind:this={dialog}
	class="bg-background shadow-2xl outline-none"
	onclose={() => form.reset()}
	onclick={(event) => {
		if (event.target === dialog) {
			dialog.close();
		}
	}}
>
	<form method="POST" use:enhance class="flex flex-col gap-6 p-6 pb-10">
		<div class="flex flex-col gap-2">
			<h2 class="text-xl font-semibold tracking-tight">Create list</h2>
			<p class="text-muted-foreground text-sm">Give your new list a name to get started.</p>
		</div>

		<div class="space-y-4">
			<Form.Field {form} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Name</Form.Label>
						<Input
							{...props}
							placeholder="e.g. Weekly Groceries"
							bind:value={$formData.name}
							autocomplete="off"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Button class="w-full">Create List</Form.Button>
		</div>
	</form>
</dialog>

<style>
	dialog {
		margin: 0;
		margin-top: auto;
		width: 100%;
		max-width: 100%;
		bottom: 0;
		border: none;
		border-top-left-radius: 1rem;
		border-top-right-radius: 1rem;
		border-top: 1px solid hsl(var(--border));
		transform: translateY(100%);
		opacity: 0;
		transition:
			transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
			opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1),
			overlay 0.3s allow-discrete,
			display 0.3s allow-discrete;
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0.4);
		opacity: 0;
		transition:
			opacity 0.3s ease-out,
			overlay 0.3s allow-discrete,
			display 0.3s allow-discrete;
	}

	dialog[open] {
		transform: translateY(0);
		opacity: 1;
	}

	dialog[open]::backdrop {
		opacity: 1;
	}

	@starting-style {
		dialog[open] {
			transform: translateY(100%);
			opacity: 0;
		}

		dialog[open]::backdrop {
			opacity: 0;
		}
	}
</style>

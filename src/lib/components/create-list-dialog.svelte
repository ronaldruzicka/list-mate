<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { createListSchema as schema } from '$lib/db/schema';
	import { fAwait } from '$lib/helpers/fawait';
	import { toast } from 'svelte-sonner';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';

	type Props = {
		data: SuperValidated<Infer<typeof schema>>;
	};

	let { data }: Props = $props();

	let dialog: HTMLDialogElement;

	const session = authClient.useSession();

	const form = superForm(data, {
		validators: zod4(schema),
		onSubmit: async ({ cancel }) => {
			// Sign in anonymously if user is not logged in
			if (!session.value?.data?.user) {
				const [error] = await fAwait(authClient.signIn.anonymous());

				if (error) {
					cancel();
					toast.error('Failed to sign in anonymously');
				}
			}
		},
		onResult: async ({ result }) => {
			if (result.type === 'redirect') {
				dialog.close();
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
	<form method="POST" action="?/create" use:enhance class="flex flex-col gap-6 p-6 pb-10">
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

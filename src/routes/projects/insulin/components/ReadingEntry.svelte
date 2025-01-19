<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import { Plus } from 'lucide-svelte';
	import { bmType } from '../insulinAnalysis';
	import { scrollY } from 'svelte/reactivity/window';
</script>

<Dialog.Root>
	
	<Dialog.Trigger
		class={buttonVariants({ size: 'lg'}) +
			' absolute right-[6vw] top-[90vh] z-50 text-lg font-semibold '}
		><Plus />
		Reading</Dialog.Trigger
	>
	<Dialog.Content class="p-4 sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Add Sugar Reading</Dialog.Title>
			<Dialog.Description>
				Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto, quis. Iste ipsum vitae
				tempore
			</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="bm" class="text-right">Sugar Level</Label>
				<Input id="bm" placeholder="mg/dl" class="col-span-3" />
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="date" class="text-right">Time</Label>
				<Input id="date" value={new Date()} class="col-span-3" />
			</div>
			<RadioGroup.Root class="flex flex-wrap gap-y-4" value="FASTING">
				{#each Object.keys(bmType) as type}
					<div class="">
						<Label for={type} class="m-1 border p-3	[&:has([data-state=checked])]:border-primary"
							>{type}
							<RadioGroup.Item class="hidden" value={type} id={type} />
						</Label>
					</div>
				{/each}
			</RadioGroup.Root>
		</div>
		<Dialog.Footer>
			<Button type="submit">Add Reading</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

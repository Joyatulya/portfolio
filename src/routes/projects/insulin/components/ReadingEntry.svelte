<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import { Plus } from 'lucide-svelte';
	import { enumBMType, type IPATIENT } from '../insulinAnalysis.types';
	import { scrollY } from 'svelte/reactivity/window';
	import { getContext } from 'svelte';
	import { number } from 'echarts/core';

	let user = getContext<IPATIENT>('user');

	let scrolled = $derived(scrollY.current && scrollY.current > 50);
	let time = $state(new Date());
	const now = new Date();
	const currentTag = setTag(now.getHours());

	function setTag(hour: number) {
		if (hour < 11) return enumBMType.FASTING;
		if (hour < 16) return enumBMType.PRE_LUNCH;
		if (hour < 19) return enumBMType.PRE_DINNER;
		return enumBMType.NIGHT;
	}
</script>

<Dialog.Root >
	<Dialog.Trigger
		class={buttonVariants({ size: 'lg' }) +
			' fixed right-[6vw] top-[90vh] z-50 text-lg font-semibold '}
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
				<Input id="bm" type="number" placeholder="mg/dl" class="col-span-3" min={20} max={1000} />
			</div>
			{#if user.insulinRegimen.type === 'basal_bolus'}
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="bm" class="text-right">Correctional Insulin Dose</Label>
					<Input id="bm" placeholder="units" class="col-span-3" />
				</div>
			{/if}
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="date" class="text-right">Time</Label>
				<Input id="date" type="time" defaultvalue={time} class="col-span-3" />
			</div>
			<RadioGroup.Root class="flex flex-wrap gap-y-4" value={currentTag}>
				{#each Object.entries(enumBMType) as [type, tag]}
					<div class="">
						<Label for={type} class="m-1 border p-3	[&:has([data-state=checked])]:border-primary"
							>{type}
							<RadioGroup.Item class="hidden" value={tag} id={type} />
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

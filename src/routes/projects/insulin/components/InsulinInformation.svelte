<script lang="ts">
	// Add confirmation as well, when putting in yes
	import Label from '$lib/components/ui/label/label.svelte';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import * as Select from '$lib/components/ui/select';
	import {
		basal_insulins,
		rapid_insulins,
		short_insulins,
		type IPATIENT
	} from '../insulinAnalysis';
	import { Input } from '$lib/components/ui/input';
	import Button from '$lib/components/ui/button/button.svelte';
	import { getContext } from 'svelte';

	const user = getContext<IPATIENT>('user');

	let user_insulin: IPATIENT['insulinRegimen'] = $state(user.insulinRegimen);
	let isBasalBolus: boolean = $state(user_insulin.type === 'basal_bolus');
</script>

<div>
	<Select.Root name="insulin_frequency" type="single" bind:value={user_insulin.type}>
		<Label>Select Your Insulin Regimen</Label>
		<Select.Trigger class="">{user_insulin.basal_insulin || 'Select your Insulin'}</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.GroupHeading class="text-lg text-muted-foreground">Once a day</Select.GroupHeading>
				{#each basal_insulins as insulin}
					<Select.Item value={insulin}>{insulin}</Select.Item>
				{/each}
			</Select.Group>
			<Select.Group>
				<Select.GroupHeading class="text-lg text-muted-foreground">Twice a day</Select.GroupHeading>
				<Select.Item value="nph_bd">{basal_insulins[0]} Twice a day</Select.Item>
			</Select.Group>
		</Select.Content>
	</Select.Root>
	{#if user_insulin.type === 'nph_bd'}
		<div class="flex gap-2 *:flex-1">
			<div class="">
				<Label for="bm" class="text-right">Insulin Time AM</Label>
				<Input id="bm" type="time" value={user_insulin.basal_am_time} placeholder="" class="" />
			</div>
			<div class="">
				<Label for="bm" class="text-right">Insulin Dose</Label>
				<Input
					id="bm"
					type="number"
					value={user_insulin.basal_am_dose}
					placeholder="units"
					class=""
				/>
			</div>
		</div>
		<div class="flex gap-2 *:flex-1">
			<div class="">
				<Label for="bm" class="text-right">Insulin Time PM</Label>
				<Input id="bm" value={user_insulin.basal_pm_time} type="time" placeholder="" class="" />
			</div>
			<div class="">
				<Label for="bm" class="text-right">Insulin Dose</Label>
				<Input
					id="bm"
					type="number"
					value={user_insulin.basal_pm_dose}
					placeholder="units"
					class=""
				/>
			</div>
		</div>
	{:else}
		<div class="flex gap-2 *:flex-1">
			<div class="">
				<Label for="bm" class="text-right">Insulin Time</Label>
				<Input id="bm" type="time" value={user_insulin.basal_time} placeholder="" class="" />
			</div>
			<div class="">
				<Label for="bm" class="text-right">Insulin Dose</Label>
				<Input id="bm" type="number" value={user_insulin.basal_dose} placeholder="units" class="" />
			</div>
		</div>
	{/if}
	{#if isBasalBolus}
		<Select.Root type="single">
			<Label>Select Your Short Acting Insulin</Label>
			<Select.Trigger class="">Insulin Type</Select.Trigger>
			<Select.Content>
				{#each [...rapid_insulins, ...short_insulins] as insulin}
					<Select.Item value={insulin}>{insulin}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
		<ToggleGroup.Root class="flex flex-wrap gap-y-4" value="FASTING">
			{#each ['Pre-Lunch', 'Pre-Dinner', 'Night'] as type}
				<div class="">
					<ToggleGroup.Item value={type} id={type}>{type}</ToggleGroup.Item>
				</div>
			{/each}
		</ToggleGroup.Root>
	{/if}
	<div class="flex flex-col gap-2 py-4">
		<Button
			onclick={() => (isBasalBolus = !isBasalBolus)}
			variant="outline"
			class="w-[75%] justify-self-start">I use pre meal insulins as well</Button
		>
		<Button class="mt-4">Update Insulin</Button>
	</div>
</div>

<!-- <div>
	<Select.Root name="insulin_frequency" type="single" bind:value={}>
		<Label>Select Your Insulin Regimen</Label>
		<Select.Trigger class="">{insulin_frequency || 'Insulin Regimen'}</Select.Trigger>
		<Select.Content>
			<Select.Item value="basal">Long Acting</Select.Item>
			<Select.Item value="basal_bolus">Long Acting with Pre-Meals</Select.Item>
		</Select.Content>
	</Select.Root>
	{#if insulin_frequency}
		<Select.Root type="single">
			<Label>Select Your Long Acting Insulin</Label>
			<Select.Trigger class="">Insulin Type</Select.Trigger>
			<Select.Content>
				{#each basal_insulins as insulin}
					<Select.Item value={insulin}>{insulin}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>

		{#if insulin_frequency === 'basal_bolus'}
			<Select.Root type="single">
				<Label>Select Your Short Acting Insulin</Label>
				<Select.Trigger class="">Insulin Type</Select.Trigger>
				<Select.Content>
					{#each [...rapid_insulins, ...short_insulins] as insulin}
						<Select.Item value={insulin}>{insulin}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
			<ToggleGroup.Root class="flex flex-wrap gap-y-4" value="FASTING">
				{#each ['Pre-Lunch', 'Pre-Dinner', 'Night'] as type}
					<div class="">
						<ToggleGroup.Item value={type} id={type}>{type}</ToggleGroup.Item>
					</div>
				{/each}
			</ToggleGroup.Root>
		{/if}
	{/if}
</div> -->

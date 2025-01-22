<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Info } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import type { IPATIENT, PARSED_BM } from './insulinAnalysis';
	import InsulinChangeReason from './components/InsulinChangeReason.svelte';

	let { bm_data }: { bm_data: PARSED_BM[] } = $props();

	const { insulin_analyser } = getContext<IPATIENT>('user');
	const recommendation = insulin_analyser.recommendation(bm_data);
	const { insulin_change, temporal_user_status, current_user_status, app_status } = recommendation;
	const { old_regimen, new_regimen, type } = insulin_change;
	let delta: number = temporal_user_status.delta;
	delta = (delta * 100).toFixed(0) + '% ' + (delta > 0 ? '↑' : '↓');
</script>

<div class="space-y-4">
	<div>
		<p>Current Sugar Control</p>
		<p class="text-3xl font-semibold">
			{current_user_status}
		</p>
	</div>
	<div>
		<p>Recent Sugar Control</p>
		<p class="text-3xl font-semibold">
			{temporal_user_status.status}
			{delta}
		</p>
	</div>
	<div>
		<p>Current Status</p>
		<p class="text-3xl font-semibold">{app_status} {@render appStatusInfo()}</p>
		<p class="text-xl font-semibold">
			{insulin_change.type === 'add' ? 'Increase' : 'Decrease'} Insulin Dose
		</p>
	</div>
	{@render BasalRegimen()}
</div>
<InsulinChangeReason {recommendation} />
<!---->

{#snippet BasalRegimen()}
	<div class="flex *:flex-1">
		<div>
			<p class="">Old Insulin Dose</p>
			<p class="text-2xl font-semibold">{old_regimen.basal_dose}</p>
		</div>
		<div>
			<p>New Insulin Dose</p>
			<p class="text-2xl font-semibold">{new_regimen.basal_dose}</p>
		</div>
	</div>
{/snippet}

{#snippet appStatusInfo()}
	<Dialog.Root>
		<Dialog.Trigger class={'size-6'}><Info /></Dialog.Trigger>
		<Dialog.Content class="p-4 sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>Different App Status Meaning</Dialog.Title>
				<Dialog.Description></Dialog.Description>
			</Dialog.Header>
			<div class="space-y-2">
				<div>
					<p class="text-lg font-semibold">Monitoring</p>
					<p>
						You have recently changed your insulin dose or regimen and we are observing your blood
						sugar levels to see how the effects of the new insulin
					</p>
				</div>
				<div>
					<p class="text-lg font-semibold">Maitenance</p>
					<p>
						You are taking insulin and your blood sugar is within the target range. We don't need to
						chanege anything. You are doing great!
					</p>
				</div>
				<div>
					<p class="text-lg font-semibold">Recommendation</p>
					<p>
						We think making the following changes would better help you achieve your blood sugar
						goals.
					</p>
				</div>
			</div>
			<Dialog.Footer></Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
{/snippet}

{#snippet userStatusInfo()}
	<Dialog.Root>
		<Dialog.Trigger class={'size-6'}><Info /></Dialog.Trigger>
		<Dialog.Content class="p-4 sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>Your Sugar Control</Dialog.Title>
				<Dialog.Description>
				</Dialog.Description>
			</Dialog.Header>
			<div>
				<p>Improving - Your efforts with diet, exercise, and medication are working.</p>
				<p>Hypoglycaemia - Your blood sugar is too low. Investigate it further.</p>
				<p>Hyperglycaemia - Blood Sugar High. Any changes in medicines, diet or insulin dose.</p>
				<p>
					Recommendation - We think making the following changes would better help you achieve your
					blood sugar goals.
				</p>
			</div>
			<Dialog.Footer></Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
{/snippet}

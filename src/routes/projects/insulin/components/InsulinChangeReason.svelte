<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import { buttonVariants } from '$lib/components/ui/button';
	import {
		Current_User_Status,
		Temporal_User_Status,
		type TRecommendation
	} from '../insulinAnalysis.types';

	let { recommendation }: { recommendation: TRecommendation } = $props();
	let {
		current_user_status,
		temporal_user_status: { status, delta },
		insulin_change: { type, old_regimen, new_regimen }
	} = $derived(recommendation);

	const delta_insulin = $derived(Math.abs(old_regimen.basal_dose - new_regimen.basal_dose));
	function text_curr_user_status(status: TRecommendation['current_user_status']) {
		let text = '';
		switch (status) {
			case Current_User_Status.HYPO:
				text = 'low sugar levels';
				break;
			case Current_User_Status.IN_RANGE:
				text = 'normal sugar levels';
				break;
			case Current_User_Status.HYPER:
				text = 'high sugar levels';
				break;
		}
		return text;
	}

	function text_temporal_user_status(status: TRecommendation['temporal_user_status']) {
		let text = '';
		switch (status) {
			case Temporal_User_Status.MAINTAINING:
				text = `remained the same.`;
				break;
			case Temporal_User_Status.IMPROVING:
				text = 'improved over the last 3 days.';
				break;
			case Temporal_User_Status.WORSENING:
				text = 'worsened over the last 3 days.';
				break;
		}
		return text;
	}
</script>

<Accordion.Root type="single" value="item-1">
	<Accordion.Item value="item-1">
		<Accordion.Trigger>Why am I being advised to change my insulin?</Accordion.Trigger>
		<Accordion.Content class="space-y-4">
			<p>
				We noted that over the past 3 days, you have had
				<span class="font-semibold">{text_curr_user_status(current_user_status)}</span>
				which have <span class="font-semibold">{text_temporal_user_status(status)}</span>
			</p>
			<p>
				Hence, we are adivising you to {type === 'add' ? 'increase' : 'decrease'} your daily insulin
				by {delta_insulin} units, from your usual
				<span class="font-semibold">{old_regimen.basal_dose} units</span>
				to
				<span class="font-semibold">{new_regimen.basal_dose} units</span>.
			</p>
			<p>
				We are hoping this will help you reach your target sugar levels soon. It is very important
				to monitor your blood sugar levels in the next few days especialLy and be on the lookout for
				any signs of <a href="insulin/hypoglycaemia">low sugar levels</a>.
			</p>
		</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>

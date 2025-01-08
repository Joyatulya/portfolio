<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';
	import { TECH_STACK } from '$lib/portfolio_data/programming';
	import { fade, slide } from 'svelte/transition';
</script>

<section class="relative grid min-h-[50vh] grid-cols-2 gap-2">
	{#each TECH_STACK as tech}
		<Popover.Root>
			<Popover.Trigger>
				<div class="flex flex-col items-center">
					<img src={tech.icon} alt={tech.name} class="h-16" />
					<p class="">{tech.name}</p>
				</div>
			</Popover.Trigger>
			<Popover.Content>
				<div in:slide>{tech.name}</div>
			</Popover.Content>
		</Popover.Root>
	{/each}
</section>

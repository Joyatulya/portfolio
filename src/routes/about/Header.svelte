<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { PanelRight } from 'lucide-svelte';
	const nav_links = [
		{ name: 'Home', link: '/' },
		{ name: 'Academics', link: '/academics' }
	];
</script>

<nav class="flex justify-end pr-6 pt-4">
	<Sheet.Root>
		<Sheet.Trigger>
			<PanelRight class="size-6" />
		</Sheet.Trigger>
		<Sheet.Content>
			<Sheet.Header>
				<Sheet.Title>Hi!</Sheet.Title>
				<Sheet.Description>
					<div>
						{#each nav_links as nav}
							<a href={nav.link} class="block">{nav.name}</a>
						{/each}
					</div>
				</Sheet.Description>
			</Sheet.Header>
		</Sheet.Content>
	</Sheet.Root>
</nav>

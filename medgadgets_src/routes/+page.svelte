<script lang="ts">
	import Auth from '$lib/auth/Auth.svelte';
	import { SITENAME, SITE_TITLE } from '$lib/siteConfigConstants';
	export let data;
	let user : string;

</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<!-- Main Header -->
<div class="hero min-h-[85vh] bg-base-200">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<h1 class="text-5xl font-bold">{SITENAME}</h1>
			<p class="py-6">{SITE_TITLE}</p>
			<button class="btn btn-primary">Get Started</button>
		</div>
	</div>
</div>

<!-- All the different calc -->

<div id="calc-container" class="grid grid-cols-1 md:grid-cols-2 p-2">
	<div class="card card-side p-2 bg-base-200 shadow-xl">
		<div class="self-center font-serif font-extrabold text-5xl mr-2 flex">
			<svg
				class="animate-bounce inline text-primary"
				style="animation: bounce 1s cubic-bezier(0.645, 0.045, 0.355, 1) 5 forwards;"
				xmlns="http://www.w3.org/2000/svg"
				width="32"
				height="32"
				viewBox="0 0 24 24"
				><path
					fill="currentColor"
					d="M13 7.828V20h-2V7.828l-5.364 5.364l-1.414-1.414L12 4l7.778 7.778l-1.414 1.414L13 7.828Z"
				/></svg
			>
			Na
		</div>
		<div class="card-body">
			<h2 class="card-title">Hypernatremia</h2>
			<p>Manage increased sodium levels</p>
			<div class="card-actions justify-end">
				<a href="/hypernatremia">
					<button class="btn btn-primary">Manage</button>
				</a>
			</div>
		</div>
	</div>
</div>

<!-- AUTH FUNCTIONALITY -->
<Auth {data}/>

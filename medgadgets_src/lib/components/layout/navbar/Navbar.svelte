 <script lang="ts">
	import { goto } from "$app/navigation";
	import { SITENAME, VERSION } from "$lib/siteConfigConstants";
	import { setTheme, toggleTheme } from "$lib/utils/themePreference";
	import { onMount } from "svelte";
	import type { PageLoad } from "../../../../routes/$types";

  let theme : string;
	export let data;

	async function getUser(){
		const {data : result} = data.supabase.from('profiles').select('*')
		console.log(result)
	}

	$: if (data.session){
		
	}

  onMount(() => {
    theme = setTheme(theme)
  })

	function handleThemeChange(){
		theme = toggleTheme(theme)
	}

 </script>

 <div class="navbar bg-base-100">
	<div class="navbar-start">


    <!-- Separate dropdown here -->
		<div class="dropdown">
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<label tabindex="0" class="btn btn-ghost btn-circle">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h7"
					/></svg
				>
			</label>
			<ul
				tabindex="0"
				class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
			>
				<a href="/">Homepage</a>
				<li on:click={handleThemeChange}>{#if theme === 'dark'}
					Light Mode
				{:else}
					Dark Mode
				{/if}</li>
				<li>V - {VERSION}</li>
			</ul>
		</div>
		<!-- Dropdown ends here -->

		
	</div>
	<div class="navbar-center">
		<a href="/" class="btn btn-ghost normal-case text-xl">{SITENAME}</a>
	</div>
	<div class="navbar-end">
		<button class="btn btn-ghost btn-circle">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
				/></svg
			>
		</button>
		<button class="btn btn-ghost btn-circle" on:click={() => goto('/user')}>
			<div class="indicator">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
					/></svg
				>
				<span class="badge badge-xs badge-primary indicator-item" />
			</div>
		</button>
	</div>
</div>
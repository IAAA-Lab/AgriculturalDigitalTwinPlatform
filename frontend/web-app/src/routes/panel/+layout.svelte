<script lang="ts">
	import { goto } from '$app/navigation';
	import Loading from '$lib/components/misc/Loading.svelte';
	import Header from '$lib/components/panel/Header.svelte';
	import Sidebar from '$lib/components/panel/Sidebar.svelte';
	import SidebarMobile from '$lib/components/panel/SidebarMobile.svelte';
	import { userService } from '$lib/config/config';
	import { TABLET_WIDTH } from '$lib/config/constants';
	import { Role } from '$lib/core/Domain';
	import { onMount } from 'svelte';

	let loading = true;

	onMount(async () => {
		try {
			const { role, id } = await userService.getUserCredentials();
			switch (role) {
				case Role.ADMIN:
				case Role.AGRARIAN:
					await userService.getEnclosureIds(id ?? '');
					await goto('/panel');
					break;
				default:
					alert('No tienes permisos para acceder a esta página');
					await goto('/panel/login', { replaceState: true });
					break;
			}
		} catch (e) {
			await goto('/panel/login');
		}
		loading = false;
	});

	let mediaQueryMobile = window.matchMedia(`(max-width: ${TABLET_WIDTH}px)`);
	let isInMobile = mediaQueryMobile.matches;

	mediaQueryMobile.addEventListener('change', () => {
		isInMobile = mediaQueryMobile.matches;
	});
</script>

{#if loading}
	<Loading />
{:else}
	<div>
		<Header />
		{#if isInMobile}
			<SidebarMobile />
		{:else}
			<Sidebar />
		{/if}
		<main>
			<slot />
		</main>
	</div>
{/if}

<style lang="scss">
	div {
		display: grid;
		grid-template-rows: 50px 1fr;
		grid-template-columns: auto 1fr;
		grid-template-areas:
			'sidebar header'
			'sidebar main';

		:global(h1) {
			font-size: 40px !important;
			margin: 0 !important;
		}

		:global(h2) {
			font-size: 30px !important;
			margin: 0 !important;
		}

		main {
			grid-area: main;
			position: relative;
			overflow: hidden;
			margin: 0 1rem;
		}
	}
</style>

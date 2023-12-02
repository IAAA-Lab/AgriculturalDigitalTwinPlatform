<script lang="ts">
	import { goto } from '$app/navigation';
	import Loading from '$lib/components/misc/Loading.svelte';
	import Header from '$lib/components/panel/Header.svelte';
	import Sidebar from '$lib/components/panel/Sidebar.svelte';
	import { enclosuresService, userService } from '$lib/config/config';
	import { userEnclosures } from '$lib/config/stores/enclosures';
	import { Role } from '$lib/core/Domain';
	import { onMount } from 'svelte';

	let loading = true;

	onMount(async () => {
		try {
			const { role, id } = await userService.getUserCredentials();
			switch (role) {
				case Role.ADMIN:
				case Role.AGRARIAN:
					const enclosureIds = await userService.getEnclosureIds(id ?? '');
					const enclosures = await enclosuresService.getEnclosures(enclosureIds);
					$userEnclosures = JSON.parse(JSON.stringify(enclosures));
					if (!location.pathname.startsWith('/panel'))
						await goto('/panel/map', { replaceState: true });
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
</script>

<div class="panel">
	{#if loading}
		<Loading />
	{:else}
		<Header />
		<Sidebar />
		<main class="pl-8 pr-8">
			<slot />
		</main>
	{/if}
</div>

<style lang="scss">
	div {
		display: grid;
		grid-template-rows: 50px 1fr;
		grid-template-columns: auto 1fr;
		grid-template-areas:
			'sidebar header'
			'sidebar main';

		main {
			grid-area: main;
			position: relative;
			overflow: hidden;
			margin: 0 0.25rem;
			display: flex;
			flex-direction: column;
			align-items: center;
		}
	}
</style>

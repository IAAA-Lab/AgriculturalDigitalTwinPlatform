<script lang="ts">
	import { goto } from '$app/navigation';
	import Loading from '$lib/components/misc/Loading.svelte';
	import { userService } from '$lib/config/config';
	import { Role } from '$lib/core/Domain';
	import { onMount } from 'svelte';

	let loading = true;

	onMount(async () => {
		try {
			const { role } = await userService.getUserCredentials();
			switch (role) {
				case Role.ADMIN:
				case Role.PRIVATE_FILES:
					await goto('/files');
					break;
				default:
					await goto('/files/login', { replaceState: true });
					alert('No tienes permisos para acceder a esta página');
					break;
			}
		} catch (e) {
			await goto('/files/login');
		}
		loading = false;
	});
</script>

<div class="panel">
	{#if loading}
		<Loading />
	{:else}
		<main>
			<slot />
		</main>
	{/if}
</div>

<style>
	main {
		padding: 0.5rem;
	}
</style>

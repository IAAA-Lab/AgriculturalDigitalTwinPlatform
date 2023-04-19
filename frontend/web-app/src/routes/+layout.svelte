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
				case Role.AGRARIAN:
					await goto('/panel');
					break;
				default:
					break;
			}
		} catch (error) {
			console.log(error);
		}
		loading = false;
	});
</script>

{#if loading}
	<Loading />
{:else}
	<slot />
{/if}

<style global lang="scss"></style>

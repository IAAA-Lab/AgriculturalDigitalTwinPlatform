<script lang="ts">
	import { userEnclosures } from '$lib/config/stores/enclosures';
	import { onMount } from 'svelte';
	import Error from '../misc/Error.svelte';
	import EnclosureMap from './EnclosureMap.svelte';

	export let enclosureId: string;
	let enclosure: Enclosure | undefined = undefined;

	onMount(() => {
		enclosure = $userEnclosures?.find((e) => e.id === enclosureId);
	});
</script>

{#if !enclosure}
	<Error />
{:else}
	<EnclosureMap {enclosure} />
{/if}

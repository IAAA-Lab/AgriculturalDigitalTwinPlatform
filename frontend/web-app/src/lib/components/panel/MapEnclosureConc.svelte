<script lang="ts">
	import { enclosuresService } from '$lib/config/config';
	import Error from '../misc/Error.svelte';
	import Loading from '../misc/Loading.svelte';
	import EnclosureMap from './EnclosureMap.svelte';

	export let enclosureId: string;
</script>

{#await enclosuresService.getEnclosures([enclosureId])}
	<Loading />
{:then enclosures}
	{@const enclosure = enclosures.at(0)}
	{#if !enclosure}
		<Error />
	{:else}
		<EnclosureMap {enclosure} />
	{/if}
{:catch}
	<Error />
{/await}

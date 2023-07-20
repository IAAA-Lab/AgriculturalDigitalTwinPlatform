<script lang="ts">
	import { userEnclosures } from '$lib/config/stores/enclosures';
	import { onMount } from 'svelte';
	import EnclosureMap from './EnclosureMap.svelte';
	import type { Enclosure } from '$lib/core/Domain';

	export let enclosureId: string;
	let enclosure: Enclosure | undefined = undefined;

	onMount(() => {
		enclosure = $userEnclosures?.find((e) => e.id === enclosureId);
	});
</script>

<EnclosureMap {enclosure} />

<script lang="ts">
	import { page } from '$app/stores';
	import Stats from '$lib/components/panel/Stats.svelte';
	import Map from '$lib/components/panel/MapEnclosureConc.svelte';
	import { userEnclosures } from '$lib/config/stores/enclosures';

	let id: string;
	let idema: string;
	$: {
		id = $page.params.id;
		idema = $userEnclosures?.find((e) => e.id === id)?.meteoStation?.idema || '';
	}
</script>

<section class="container-responsive">
	<h1 class="title p-0">Recinto#{id} · Mapa</h1>
	<Map enclosureId={id} />
	<Stats enclosureId={id} {idema} />
</section>

<style lang="scss">
	section {
		overflow-y: scroll;
		display: grid;
		gap: 0.8rem;
		grid-template-rows: 0fr 1.5fr 400px;
		height: 100%;
	}

	@include media('<large') {
		section {
			height: auto !important;
			margin-bottom: 0.5rem;
		}
	}
</style>

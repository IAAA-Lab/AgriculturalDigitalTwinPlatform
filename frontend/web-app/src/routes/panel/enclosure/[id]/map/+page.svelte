<script lang="ts">
	import { page } from '$app/stores';
	import Stats from '$lib/components/panel/Stats.svelte';
	import Map from '$lib/components/panel/MapEnclosureConc.svelte';

	let id: string;
	export let idema = '9434';
	$: {
		id = $page.params.id;
	}
</script>

<div class="container-responsive">
	<h1 class="title pb-16">Recinto#{id} · Mapa</h1>
	<div class="inner__container">
		<Map enclosureId={id} />
		<Stats enclosureId={id} {idema} />
	</div>
</div>

<style lang="scss">
	.inner__container {
		display: grid;
		gap: 0.8rem;
		height: calc(100vh - 7rem);
		grid-template-rows: 0.75fr 1fr;
	}

	@include media('<large') {
		.inner__container {
			height: auto !important;
		}
	}
</style>

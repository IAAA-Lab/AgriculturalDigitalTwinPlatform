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

<section class="container-responsive">
	<h1 class="title pb-16">Recinto#{id} · Mapa</h1>
	<div class="inner__container">
		<Map enclosureId={id} />
		<Stats enclosureId={id} {idema} />
	</div>
</section>

<style lang="scss">
	section {
		overflow-y: scroll;
	}
	.inner__container {
		display: grid;
		gap: 0.8rem;
		grid-template-rows: 1.5fr 1fr;
		height: calc(100vh - 7.1rem);
	}

	@include media('<large') {
		.inner__container {
			height: auto !important;
		}
	}
</style>

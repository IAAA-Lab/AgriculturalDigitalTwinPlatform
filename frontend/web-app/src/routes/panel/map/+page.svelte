<script lang="ts">
	import Error from '$lib/components/misc/Error.svelte';
	import Loading from '$lib/components/misc/Loading.svelte';
	import Map from '$lib/components/panel/Map.svelte';
	import Search from '$lib/components/panel/Search.svelte';
	import SearchPopup from '$lib/components/panel/SearchPopup.svelte';
	import { enclosuresService } from '$lib/config/config';
	import type { Enclosure, NDVI } from '$lib/core/Domain';
	import { TABLET_WIDTH } from '$lib/config/constants';
	import { listOfEnclosures } from '$lib/config/stores/selectedEnclosure';
	import { onMount } from 'svelte';

	let mediaQueryMobile = window.matchMedia(`(max-width: ${TABLET_WIDTH}px)`);
	let isInMobile = mediaQueryMobile.matches;

	mediaQueryMobile.addEventListener('change', () => {
		isInMobile = mediaQueryMobile.matches;
	});

	let enclosures: Enclosure[] | undefined = [];
	let enclosuresFiltered: Enclosure[] | undefined;

	$: console.log(enclosuresFiltered);

	onMount(() => {
		enclosuresService
			.getEnclosures($listOfEnclosures)
			.then((enclosuresRes) => {
				enclosures = [...enclosuresRes];
				enclosuresService
					.getNDVI($listOfEnclosures, undefined, undefined, 1)
					.then((res: NDVI[]) => {
						enclosures = enclosuresRes.map((enclosure) => {
							const ndvi = res.find((ndvi) => ndvi.enclosureId === enclosure.id);
							return {
								...enclosure,
								properties: {
									...enclosure.properties,
									ndvi: ndvi
								}
							};
						});
					})
					.catch((err) => {
						enclosures = undefined;
					});
			})
			.catch((err) => {
				enclosures = undefined;
			});
	});
</script>

<section class="container-responsive">
	<h1 class="title">Mapa</h1>
	<div class="inner__container">
		{#if enclosures?.length === 0}
			<Loading />
		{:else if enclosures?.length > 0}
			<Map {enclosures} />
			{#if isInMobile}
				<SearchPopup>
					<Search {enclosures} bind:enclosuresFiltered />
				</SearchPopup>
			{:else}
				<Search {enclosures} />
			{/if}
		{:else}
			<Error />
		{/if}
	</div>
</section>

<style lang="scss">
	section {
		overflow-y: scroll;
	}
	.inner__container {
		display: grid;
		gap: 0.8rem;
		height: calc(100vh - 6.3rem);
		grid-template-columns: 1fr 400px;
	}

	@include media('<large') {
		.inner__container {
			padding: 0;
			margin-top: 16px;
			grid-template-columns: 1fr;
			height: calc(100vh - 5rem);
		}
	}
</style>

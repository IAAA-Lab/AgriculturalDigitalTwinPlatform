<script>
	import Error from '$lib/components/misc/Error.svelte';
	import Loading from '$lib/components/misc/Loading.svelte';
	import Map from '$lib/components/panel/Map.svelte';
	import Search from '$lib/components/panel/Search.svelte';
	import SearchPopup from '$lib/components/panel/SearchPopup.svelte';
	import { enclosuresService } from '$lib/config/config';
	import { TABLET_WIDTH } from '$lib/config/constants';
	import { listOfEnclosures } from '$lib/config/stores/selectedEnclosure';

	let mediaQueryMobile = window.matchMedia(`(max-width: ${TABLET_WIDTH}px)`);
	let isInMobile = mediaQueryMobile.matches;

	mediaQueryMobile.addEventListener('change', () => {
		isInMobile = mediaQueryMobile.matches;
	});
</script>

<section class="container-responsive">
	<h1 class="title">Mapa</h1>
	<div class="inner__container">
		{#await enclosuresService.getEnclosures($listOfEnclosures)}
			<Loading />
		{:then enclosures}
			<Map {enclosures} />
			{#if isInMobile}
				<SearchPopup>
					<Search {enclosures} />
				</SearchPopup>
			{:else}
				<Search {enclosures} />
			{/if}
		{:catch}
			<Error />
		{/await}
	</div>
</section>

<style lang="scss">
	.inner__container {
		display: grid;
		gap: 0.8rem;
		height: calc(100vh - 8.5rem);
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

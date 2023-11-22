<script lang="ts">
	import CropCard from './CropCard.svelte';

	export let enclosureId: string;
	export let crop: any;
	console.log(enclosureId);
</script>

<section class="card">
	<h3 class="m-0 mb-16">Plantas cultivadas</h3>
	<a href="/panel/enclosure/crops?enclosureId={enclosureId}">
		<CropCard {crop} {enclosureId} />
	</a>
</section>

<style type="scss">
	section {
		grid-area: crops;
	}
</style>

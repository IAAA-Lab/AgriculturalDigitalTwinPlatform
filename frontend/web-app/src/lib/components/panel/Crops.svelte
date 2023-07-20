<script lang="ts">
	import CropCard from './CropCard.svelte';

	export let enclosureId: string;
	export let crop: any;
</script>

<section class="card">
	<h3 class="m-0 mb-16">Plantas cultivadas</h3>
	<a href="/panel/enclosure/{enclosureId}/crops">
		<CropCard {crop} {enclosureId} />
	</a>
</section>

<style type="scss">
	section {
		grid-area: crops;
	}
</style>

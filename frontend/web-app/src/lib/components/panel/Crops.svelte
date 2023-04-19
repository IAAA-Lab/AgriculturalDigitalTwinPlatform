<script lang="ts">
	import type { Crop } from '$lib/core/Domain';
	import Card from './Card.svelte';
	import CropCard from './CropCard.svelte';

	export let enclosureId: string;
	export let crop: Crop;
</script>

<section>
	<Card>
		<h3 slot="header" class="m-0 mb-16">Plantas cultivadas</h3>
		<svelte:fragment slot="body">
			<a href="/enclosure/{enclosureId}/crops">
				<CropCard {crop} />
			</a>
		</svelte:fragment>
	</Card>
</section>

<style type="scss">
	section {
		grid-area: crops;
	}
	:global(a) {
		width: 100%;
	}
</style>

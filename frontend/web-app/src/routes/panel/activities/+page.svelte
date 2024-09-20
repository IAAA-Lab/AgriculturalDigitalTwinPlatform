<script lang="ts">
	import Activities from '../../../lib/components/panel/Activities.svelte';
	import Commands from '../../../lib/components/panel/Commands.svelte';
	import { IMAGES_SERVER_URL } from '$lib/config/config';
	import { onCropImageError } from '$lib/core/functions';
	import { page } from '$app/stores';
	import { userEnclosures } from '$lib/config/stores/enclosures';

	let digitalTwinId: string | undefined =
		$page.url.searchParams.get('digitalTwinId') || $userEnclosures.at(0)?.id;
	let digitalTwin: DigitalTwin | undefined = undefined;

	$: digitalTwin = $userEnclosures.find((e) => e.id === digitalTwinId);
</script>

<div class="header mb-8">
	<img
		src={`${IMAGES_SERVER_URL}/${digitalTwin?.properties?.crop?.id}.png`}
		alt="Análisis"
		height="40px"
		on:error={onCropImageError}
	/>
	<h3>{digitalTwin.properties.crop.name || 'Cultivo desconocido'}</h3>
	<select bind:value={digitalTwinId}>
		{#each $userEnclosures as digitalTwin}
			<option value={digitalTwin.id}>{digitalTwin.id}</option>
		{/each}
	</select>
</div>
<section class="container-responsive">
	<div class="sep">
		<div>
			<Activities {digitalTwinId} />
		</div>
		<div>
			<Commands {digitalTwinId} />
		</div>
	</div>
	<br />
</section>

<style lang="scss">
	.header {
		display: flex;
		flex-wrap: wrap;
		column-gap: 0.5rem;
		align-items: center;
	}

	.sep {
		display: flex;
		column-gap: 0.5rem;
		flex-direction: row;
		flex-wrap: wrap;

		:first-child {
			flex: 4;
		}

		:last-child {
			flex: 1;
		}
	}
</style>

<script lang="ts">
	import { page } from '$app/stores';
	import { IMAGES_SERVER_URL, digitalTwinsService } from '$lib/config/config';
	import { userEnclosures } from '$lib/config/stores/enclosures';
	import type { DigitalTwin, SimulationInfo } from '$lib/core/Domain';
	import { onCropImageError } from '$lib/core/functions';
	import { onMount } from 'svelte';
	import { formattedTime } from '../../../lib/core/functions';

	let digitalTwinId: string | undefined =
		$page.url.searchParams.get('digitalTwinId') || $userEnclosures.at(0)?.id;
	let digitalTwin: DigitalTwin | undefined = undefined;

	$: digitalTwin = $userEnclosures.find((e) => e.id === digitalTwinId);
</script>

<h1>Simulaciones</h1>

{#if !digitalTwin}
	<h1>Enclosure not found</h1>
{:else}
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
	<section class="container">
		<a class="card" href="simulations/{digitalTwinId}">
			<h3>Nueva simulación</h3>
		</a>
		{#if digitalTwinId}
			{#await digitalTwinsService.getSimulations(digitalTwinId) then simulations}
				{#each simulations as simulation}
					<a
						class="card"
						href="simulations/{digitalTwin.id}?simulationId={simulation.simulationId}"
					>
						<h3 class="m-0">Id: {simulation.simulationId}</h3>
						<span
							><strong>Inicio</strong>: {formattedTime(simulation.startDate)} -
							<strong>Finaliza</strong>: {formattedTime(simulation.endDate)}</span
						>
						<p class="m-0"><strong>Número árboles</strong>: {simulation.numTrees}</p>
					</a>
				{/each}
			{:catch error}
				<p>{error.message}</p>
			{/await}
		{/if}
	</section>
{/if}

<style lang="scss">
	.container {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
		gap: 1em;
	}

	.header {
		display: flex;
		flex-wrap: wrap;
		column-gap: 0.5rem;
		align-items: center;
	}

	h1 {
		margin: 0;
	}
</style>

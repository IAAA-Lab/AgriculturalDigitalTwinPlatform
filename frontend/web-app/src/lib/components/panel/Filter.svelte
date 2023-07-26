<script lang="ts">
	import type { Enclosure } from '$lib/core/Domain';

	export let enclosures: Enclosure[] = [];
	export let checkedCrops: string[] = [];
	let showMoreCrops = false;
	export let checkedLocations: string[] = [];
	let showMoreLocations = false;
	export let orderBy: string | undefined = undefined;
	export let limit: number = 0;
	// inputs refs
	let orderBySelect: HTMLSelectElement;

	let uniqueCrops: string[] = [];
	$: uniqueCrops = [
		...new Set(
			enclosures.map((enclosure) => enclosure.properties.cropName).filter((crop) => crop.length > 0)
		)
	];
	let uniqueLocations: string[] = [];
	$: uniqueLocations = [
		...new Set(
			enclosures
				.map((enclosure) => enclosure.properties.geographicSpot)
				.filter((location) => location.length > 0)
		)
	];

	const resetFilters = () => {
		checkedCrops = [];
		checkedLocations = [];
		orderBy = undefined;
		limit = 0;
		// Empty selects
		orderBySelect.selectedIndex = 0;
	};
</script>

<div class="header">
	<h2 class="m-0">Filtros</h2>
	<button type="button" class="button-xs" on:click={() => resetFilters()}>
		<i class="fi fi-rr-trash-undo-alt" />
	</button>
</div>
<form>
	<div style="overflow-y: scroll;">
		<h4 class="m-0">Cultivo</h4>
		{#each showMoreCrops ? uniqueCrops : uniqueCrops.slice(0, 10) as crop}
			<label class="badge" for={crop}>
				<input
					hidden
					type="checkbox"
					id={crop}
					name={crop}
					value={crop}
					bind:group={checkedCrops}
				/>{crop}
			</label>
		{/each}
		{#if uniqueCrops.length > 10}
			<button
				class="button-secondary"
				type="button"
				on:click={() => (showMoreCrops = !showMoreCrops)}
			>
				{showMoreCrops ? 'Mostrar menos' : 'Mostrar más'}
			</button>
		{/if}
		<div>
			<h4 class="m-0 mt-16">Localización</h4>
			{#each showMoreLocations ? uniqueLocations : uniqueLocations.slice(0, 10) as location}
				<label class="badge" for={location}>
					<input
						hidden
						type="checkbox"
						id={location}
						name={location}
						value={location}
						bind:group={checkedLocations}
					/>{location}
				</label>
			{/each}
			{#if uniqueLocations.length > 10}
				<button
					class="button-secondary"
					type="button"
					on:click={() => (showMoreLocations = !showMoreLocations)}
				>
					{showMoreLocations ? 'Mostrar menos' : 'Mostrar más'}
				</button>
			{/if}
		</div>
		<h2 class="m-0 mb-16 mt-16">Ordenar por</h2>
		<div class="select-button-group">
			<select placeholder="Ordenar por..." bind:value={orderBy} bind:this={orderBySelect}>
				<option selected value={undefined}>Por defecto</option>
				<option value="crop"> Cultivo </option>
				<option value="location"> Localización </option>
				<option value="area"> Área - Descendente </option>
				<option value="ndviDesc"> NDVI - Descendente </option>
				<option value="ndviAsc"> NDVI - Ascendente </option>
			</select>
		</div>
		<h2 class="m-0 mb-16 mt-16">Límite</h2>
		<div class="limit-input-group">
			<input
				type="range"
				name="limit"
				min="0"
				max={enclosures.length}
				bind:value={limit}
				step="10"
			/>
			<span>{limit === 0 ? 'Ilim.' : limit}</span>
		</div>
		<button class="button-primary button-xs mt-32" type="button" on:click={() => resetFilters()}>
			Resetear
		</button>
	</div>
</form>

<style lang="scss">
	form {
		height: 95%;
		display: flex;
		flex-direction: column;
		margin: 0 5px;
	}
	button {
		display: block;
		width: 100%;
	}

	label {
		display: block !important;
	}

	.badge {
		cursor: pointer;
	}

	select {
		width: 100%;
	}

	.limit-input-group {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		column-gap: 0.5rem;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;

		button {
			width: auto;
		}
	}
</style>

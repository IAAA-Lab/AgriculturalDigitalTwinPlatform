<script lang="ts">
	import type { Enclosure } from '$lib/core/Domain';

	export let open: boolean = false;
	export let enclosures: Enclosure[] = [];
	export let selectedCrop: string | undefined = undefined;
	export let selectedLocation: string | undefined = undefined;
	export let orderBy: string | undefined = undefined;
	export let limit: number = 0;
	let limitValue: number = 0;

	let uniqueCrops: string[] = [];
	$: uniqueCrops = [...new Set(enclosures.map((enclosure) => enclosure.properties.cropName))];
	let uniqueLocations: string[] = [];
	$: uniqueLocations = [
		...new Set(enclosures.map((enclosure) => enclosure.properties.geographicSpot))
	];

	const applyFilters = () => {
		selectedCrop =
			document.querySelector('select')?.value === 'undefined'
				? undefined
				: document.querySelector('select')?.value;
		selectedLocation =
			document.querySelectorAll('select')[1]?.value === 'undefined'
				? undefined
				: document.querySelectorAll('select')[1]?.value;
		orderBy =
			document.querySelectorAll('select')[2]?.value === 'undefined'
				? undefined
				: document.querySelectorAll('select')[2]?.value;
		limit = limitValue;
		open = false;
	};

	const resetFilters = () => {
		selectedCrop = undefined;
		selectedLocation = undefined;
		orderBy = undefined;
		limit = 0;
		open = false;
		// Empty selects
		document.querySelectorAll('select').forEach((select) => {
			select.selectedIndex = 0;
		});
	};
</script>

<dialog {open}>
	<form class="body">
		<h2 class="m-0 mb-16">Filtros</h2>
		<div>
			<label> Cultivo </label>
			<select placeholder="Cultivo">
				<option selected disabled hidden value={undefined}>Elige un cultivo</option>
				{#each uniqueCrops as crop}
					<option value={crop}> {crop} </option>
				{/each}
			</select>
		</div>
		<div>
			<label> Localización </label>
			<select placeholder="Cultivo">
				<option selected disabled hidden value={undefined}>Localización</option>
				{#each uniqueLocations as location}
					<option value={location}> {location} </option>
				{/each}
			</select>
		</div>
		<h2 class="m-0 mb-16 mt-16">Ordenar por</h2>
		<div>
			<select placeholder="Ordenar por...">
				<option selected disabled hidden value={undefined}>Ordenar por...</option>
				<option value="crop"> Cultivo </option>
				<option value="location"> Localización </option>
				<option value="area"> Área - Descendente </option>
				<option value="ndviDesc"> NDVI - Descendente </option>
				<option value="ndviAsc"> NDVI - Ascendente </option>
			</select>
		</div>
		<h2 class="m-0 mb-16 mt-16">Límite de resultados</h2>
		<div class="limit-input-group">
			<input type="range" name="limit" min="0" max="200" bind:value={limitValue} step="10" />
			<span>{limitValue}</span>
		</div>
		<div class="button-group mt-32">
			<button class="button-primary" type="submit" on:click={() => applyFilters()}>
				Aplicar
			</button>
			<button class="button-secondary" type="button" on:click={() => resetFilters()}>
				Resetear
			</button>
		</div>
	</form>
</dialog>

<style>
	dialog {
		border: 2px solid #ccc;
		border-radius: 10px;
		position: absolute;
		top: 50px;
		right: 0;
		z-index: 1000;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
		width: 80%;
	}

	label {
		display: block !important;
	}

	select {
		width: 100%;
	}

	.limit-input-group {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		column-gap: 1rem;
	}

	.button-group {
		display: flex;
		justify-content: space-between;
	}

	.body {
		display: flex;
		flex-direction: column;
	}

	/* Animate on open dialog */
	dialog[open] {
		animation: fadeIn 0.3s ease-in-out;
	}

	@keyframes fadeIn {
		0% {
			opacity: 0;
			transform: translateY(-10px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>

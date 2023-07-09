<script lang="ts">
	import type { Enclosure } from '$lib/core/Domain';

	export let open: boolean = false;
	export let enclosures: Enclosure[] = [];
	export let selectedCrop: string | undefined = undefined;
	export let selectedLocation: string | undefined = undefined;
	export let orderBy: string | undefined = undefined;
	export let limit: number = 0;
	let limitValue: number = 0;
	// inputs refs
	let cropSelect: HTMLSelectElement;
	let locationSelect: HTMLSelectElement;
	let orderBySelect: HTMLSelectElement;

	let uniqueCrops: string[] = [];
	$: uniqueCrops = [...new Set(enclosures.map((enclosure) => enclosure.properties.cropName))];
	let uniqueLocations: string[] = [];
	$: uniqueLocations = [
		...new Set(enclosures.map((enclosure) => enclosure.properties.geographicSpot))
	];

	const applyFilters = () => {
		selectedCrop = cropSelect.value === 'undefined' ? undefined : cropSelect.value;
		selectedLocation = locationSelect.value === 'undefined' ? undefined : locationSelect.value;
		orderBy = orderBySelect.value === 'undefined' ? undefined : orderBySelect.value;
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
		cropSelect.selectedIndex = 0;
		locationSelect.selectedIndex = 0;
		orderBySelect.selectedIndex = 0;
	};
</script>

<dialog {open}>
	<form class="body">
		<h2 class="m-0 mb-16">Filtros</h2>
		<div>
			<label> Cultivo </label>
			<div class="select-button-group">
				<select placeholder="Cultivo" bind:this={cropSelect}>
					<option selected disabled hidden value={undefined}>Elige un cultivo</option>
					{#each uniqueCrops as crop}
						<option value={crop}> {crop} </option>
					{/each}
				</select>
				<button class="button-xs button-secondary" on:click={() => (cropSelect.selectedIndex = 0)}>
					<i class="fi fi-rr-cross" />
				</button>
			</div>
			<div>
				<label> Localización </label>
				<div class="select-button-group">
					<select placeholder="Localización" bind:this={locationSelect}>
						<option selected disabled hidden value={undefined}>Localización</option>
						{#each uniqueLocations as location}
							<option value={location}> {location} </option>
						{/each}
					</select>
					<button
						class="button-xs button-secondary"
						on:click={() => (locationSelect.selectedIndex = 0)}
					>
						<i class="fi fi-rr-cross" />
					</button>
				</div>
			</div>
			<h2 class="m-0 mb-16 mt-16">Ordenar por</h2>
			<div class="select-button-group">
				<select placeholder="Ordenar por..." bind:this={orderBySelect}>
					<option selected disabled hidden value={undefined}>Ordenar por...</option>
					<option value="crop"> Cultivo </option>
					<option value="location"> Localización </option>
					<option value="area"> Área - Descendente </option>
					<option value="ndviDesc"> NDVI - Descendente </option>
					<option value="ndviAsc"> NDVI - Ascendente </option>
				</select>
				<button
					class="button button-xs button-secondary"
					on:click={() => (orderBySelect.selectedIndex = 0)}
				>
					<i class="fi fi-rr-cross" />
				</button>
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
		</div>
	</form>
</dialog>

<style lang="scss">
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

	.button-group,
	.select-button-group {
		display: flex;
		justify-content: space-between;
		column-gap: 0.5rem;
		i {
			font-size: 0.5rem;
		}
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

<script lang="ts">
	import type { Enclosure } from '$lib/core/Domain';

	export let open: boolean = false;
	export let enclosures: Enclosure[] = [];
	export let selectedCrop: string | undefined = undefined;
	export let selectedLocation: string | undefined = undefined;

	let uniqueCrops: string[] = [];
	$: uniqueCrops = [...new Set(enclosures.map((enclosure) => enclosure.properties.cropName))];
	let uniqueLocations: string[] = [];
	$: uniqueLocations = [
		...new Set(enclosures.map((enclosure) => enclosure.properties.geographicSpot))
	];

	const applyFilters = () => {
		selectedCrop = document.querySelector('select')?.value;
		selectedLocation = document.querySelector('select:nth-child(2)')?.value;
		open = false;
	};

	const resetFilters = () => {
		selectedCrop = undefined;
		selectedLocation = undefined;
		open = false;
	};
</script>

<dialog {open}>
	<h2 class="m-0 mb-16">Filtros</h2>
	<form class="body">
		<div>
			<label> Cultivo </label>
			<select placeholder="Cultivo">
				<option selected disabled hidden>Elige un cultivo</option>
				{#each uniqueCrops as crop}
					<option value={crop}> {crop} </option>
				{/each}
			</select>
		</div>
		<div>
			<label> Localización </label>
			<select placeholder="Cultivo">
				<option selected disabled hidden>Localización</option>
				{#each uniqueLocations as location}
					<option value={location}> {location} </option>
				{/each}
			</select>
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

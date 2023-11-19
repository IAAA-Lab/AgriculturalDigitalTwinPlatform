<script lang="ts">
	import { onMount } from 'svelte';

	const DEFAULT_FILTERS = {
		filters: [{}],
		orderBy: [{}],
		limit: 0,
		maxLimit: 0,
		search: ''
	};

	let filters = DEFAULT_FILTERS;

	const resetFilters = () => {
		filters = DEFAULT_FILTERS;
	};

	const fetchFilters = async () => {
		filters = {
			filters: [
				{
					key: 'cropName',
					name: 'Cultivo',
					data: [
						'Maíz',
						'Trigo',
						'Cebada',
						'Girasol',
						'Colza',
						'Remolacha',
						'Algodón',
						'Arroz',
						'Otros'
					]
				},
				{
					key: 'location.province',
					name: 'Provincia',
					data: ['Almería', 'Cádiz', 'Córdoba', 'Granada', 'Huelva', 'Jaén', 'Málaga', 'Sevilla']
				},
				{
					key: 'location.ccaa',
					name: 'CCAA',
					data: [
						'Andalucía',
						'Aragón',
						'Asturias',
						'Baleares',
						'Canarias',
						'Cantabria',
						'Castilla-La Mancha',
						'Castilla y León',
						'Cataluña',
						'Extremadura',
						'Galicia',
						'La Rioja',
						'Madrid',
						'Murcia',
						'Navarra',
						'País Vasco',
						'Valencia'
					]
				},
				{
					key: 'properties.geographicSpot',
					name: 'Localización',
					data: ['Almería', 'Cádiz', 'Córdoba', 'Granada', 'Huelva', 'Jaén', 'Málaga', 'Sevilla']
				}
			],
			orderBy: [
				{
					key: 'cropName',
					name: 'Cultivo'
				},
				{
					key: 'location.province',
					name: 'Provincia'
				},
				{
					key: 'location.ccaa',
					name: 'CCAA'
				},
				{
					key: 'properties.geographicSpot',
					name: 'Localización'
				}
			],
			limit: 0,
			maxLimit: 0,
			search: ''
		};
	};

	onMount(async () => {
		await fetchFilters();
	});
</script>

<div class="header">
	<h2 class="m-0">Filtros</h2>
	<button type="button" class="button-xs" on:click={() => resetFilters()}>
		<i class="fi fi-rr-trash-undo-alt" />
	</button>
</div>
<form>
	<div style="overflow-y: scroll;">
		{#each filters.filters as filter}
			<h2 class="m-0 mb-16 mt-16">{filter.name}</h2>
			<div class="badge-group">
				<!-- {#each filter.data as data}
					<span class="badge">{data}</span>
				{/each} -->
			</div>
		{/each}
		<h2 class="m-0 mb-16 mt-16">Ordenar por</h2>
		<div class="select-button-group">
			<select placeholder="Ordenar por...">
				{#each filters.orderBy as filter}
					<option value={filter.key}>{filter.name}</option>
				{/each}
			</select>
		</div>
		<h2 class="m-0 mb-16 mt-16">Límite</h2>
		<div class="limit-input-group">
			<input
				type="range"
				name="limit"
				min="0"
				max={filters['maxLimit']}
				bind:value={filters['limit']}
				step="10"
			/>
			<span>{filters['limit'] === 0 ? 'Ilim.' : filters['limit']}</span>
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

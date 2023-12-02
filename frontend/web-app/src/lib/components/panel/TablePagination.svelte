<script lang="ts">
	import Table from './Table.svelte';

	export let rows: any = [];
	export let columns: any = [];
	export let length: number = 0;

	const LIMIT = 12;
	let pages = Math.ceil(rows.length / LIMIT);
	let currentPage = 1;
	let search = '';
	let filteredRows: any = [];

	$: {
		if (search === '') {
			filteredRows = rows;
		}
		filteredRows = rows.filter((row: any) => {
			return row.id.toLowerCase().includes(search.toLowerCase());
		});
	}

	$: {
		pages = Math.ceil(filteredRows.length / LIMIT);
		currentPage = 1;
	}
</script>

<div class="card">
	<Table rows={filteredRows.slice((currentPage - 1) * LIMIT, currentPage * LIMIT)} {columns} />
	<div class="bottom">
		<span class="text-xs">Mostrando {filteredRows.length} de {length}</span>
		<input type="search" placeholder="Buscar..." bind:value={search} />
		<div class="pagination">
			{#if pages > 3}
				<a
					class:disabled={currentPage === 1}
					href="#"
					on:click={() => (currentPage = currentPage === 1 ? currentPage : currentPage - 1)}
					>{`<`}</a
				>
				{#each Array.from({ length: 3 }, (_, i) => i + 1) as page}
					<a href="#" on:click={() => (currentPage = page)}>{page}</a>
				{/each}
				<a class:current={true} href="#"><strong>{currentPage}</strong></a>
				<span>...</span>
				<a href="#" on:click={() => (currentPage = pages)}>{pages}</a>
				<a
					class:disabled={currentPage === pages}
					href="#"
					on:click={() => (currentPage = currentPage === pages ? currentPage : currentPage + 1)}
					>{`>`}</a
				>
			{:else}
				{#each Array.from({ length: pages }, (_, i) => i + 1) as page}
					<a href="#" on:click={() => (currentPage = page)}>{page}</a>
				{/each}
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	.card {
		position: relative;
		height: 96.5%;
		display: flex;
		flex-direction: column;
	}

	.bottom {
		position: absolute;
		// Center down the pagination
		bottom: 10px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 1rem;

		.pagination {
			display: flex;
			gap: 0.5rem;
			align-items: center;
		}
	}

	.pagination a {
		text-decoration: none;
		background-color: color-bg(primary);
		color: color(text);
		padding: 0.25rem 0.5rem;
		border-radius: 5px;

		&:hover {
			background-color: rgba(color-bg(primary), 0.6);
		}

		&.disabled {
			pointer-events: none;
			opacity: 0.5;
		}

		&.current {
			background-color: color-bg(secondary);
			pointer-events: none;
		}
	}

	input {
		max-width: 250px;
	}
</style>

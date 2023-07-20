<script lang="ts">
	import SummaryStatCard from './SummaryStatCard.svelte';

	let statsSelected: any[] = [];
</script>

<section class="card">
	<div class="summary__title mt-8">
		<h2 class="m-0">Resumen</h2>
		<!-- <ToggleSwitch bind:checked /> -->
	</div>
	<span>Última actualización: --</span>
	<div class="body">
		<div class="body-stats mb-16">
			{#each statsSelected as stat, i}
				<a href="/enclosure/{stat.enclosureId}">
					<SummaryStatCard
						title={stat.stat.name}
						value={stat.stat.value}
						unit={stat.stat.unit || ''}
						diff={stat.diff}
						enclosureName={stat.enclosureId}
						crops={stat.cropIds}
						primary={i === 0}
					/>
				</a>
			{/each}
		</div>
	</div>
</section>

<style lang="scss">
	.card {
		grid-area: summary;

		.header__wrapper {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.summary__title {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.body {
			max-height: 500px;
			padding: 0px 5px 10px 5px;
		}
		.body-stats {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
			grid-gap: 0.75rem;
		}

		.analytics-chart {
			// max-height: 175px;
			padding: 5px;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}
	}
</style>

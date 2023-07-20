<script lang="ts">
	import { numberWithCommas } from '$lib/core/functions';

	export let statName = '--';
	export let statValue: number | string = '--';
	export let statUnit = '';
</script>

<div class="card">
	<div class="stat-icon">
		<slot />
	</div>
	<div class="ml-8 stat-content">
		<h4 class="m-0">
			{statName}
		</h4>
		<div class="stat-value-unit">
			<h2 class="m-0 fw-600">
				{numberWithCommas(statValue)}
			</h2>
			<span class="ml-8 text-xs">
				{statUnit}
			</span>
		</div>
	</div>
</div>

<style lang="scss">
	.card {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		white-space: nowrap;

		@include media('<medium') {
			white-space: normal;
		}

		.stat-icon {
			width: 50px;
			height: 50px;
			background: color-bg(primary);
			border-radius: 10px;
			border: solid 2px color(primary);
			display: flex;
			align-items: center;
			justify-content: center;

			:global(i) {
				font-size: 30px;
				color: color(primary);
			}
		}

		.stat-content {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: center;

			.stat-value-unit {
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				align-items: center;
				justify-content: center;
			}
		}
	}
</style>

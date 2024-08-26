<script lang="ts">
	import type { Prediction } from '$lib/core/Domain';

	const startDate = new Date();
	startDate.setDate(startDate.getDate() - 30);
	let currentHour = new Date().getHours();

	export let pred: Prediction;
</script>

<div class="card">
	<div class="header">
		<i class="fi fi-rr-wind" />
		<p class="m-0">Viento</p>
	</div>
	<div class="body">
		<i class="fi fi-rr-compass-slash" style="font-size: 4rem"></i>
		<p class="text-m m-0">
			<strong
				>{pred?.wind?.find((w) => w.period == String(currentHour))?.speed?.at(0) || '--'}
				km/h</strong
			>
		</p>
	</div>
</div>

<style>
	.card {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		row-gap: 0.5rem;
		width: 125px;
		height: min-content;
	}
</style>

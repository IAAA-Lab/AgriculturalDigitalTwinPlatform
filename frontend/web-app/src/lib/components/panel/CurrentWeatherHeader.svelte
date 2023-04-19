<script>
	import { formattedTime } from '$lib/core/functions';

	export let date = '--';
	export let address = '--';
	export let ta = '--';
	export let skyState = '--';
</script>

<div class="header mb-8">
	<h2 class="m-0">Tiempo actual</h2>
	<time class="m-0 text-xs">{formattedTime(date)}</time>
</div>
<div class="main-preview mb-16">
	<p class="m-0 text-sm">
		{address}
	</p>
	<div class="skyState__wrapper">
		<div class="skyState">
			<slot name="icon" />
			<p class="m-0 text-sm skyState">{skyState}</p>
		</div>
		<p class="m-0 fw-700 temp" style="white-space: nowrap; margin-top: 1rem">
			{ta} °
		</p>
	</div>
</div>

<style lang="scss">
	.header {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-between;
	}
	.temp {
		font-size: 3rem !important;
	}

	.skyState {
		font-size: 1rem !important;
	}

	.main-preview {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-evenly;
		background: #5c8cd3;
		border: 1px solid #e3e3e3;
		box-shadow: inset 0px 0px 30px rgba(52, 95, 160, 0.4);
		border-radius: 10px;
		min-width: 200px;
		padding: 0.5rem;
		color: whitesmoke;
		padding-bottom: 2rem;

		:global(i) {
			font-size: 2.75rem;
		}

		.skyState__wrapper {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			row-gap: 0.75rem;
		}

		.skyState {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			row-gap: 0.75rem;
		}
	}
</style>

<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	export let digitalTwinId: string;
	let eventSource: EventSource | undefined = undefined;
	let temperature: any = undefined;
	let humidity: any = undefined;
	let pH: any = undefined;

	onMount(() => {
		// Websocket connection
		eventSource = new EventSource(
			`http://localhost:8080/enclosures/${digitalTwinId}/sensor-stream`
		);
		eventSource.onmessage = function (event) {
			const data = JSON.parse(event.data);
			switch (data.type) {
				case 'temperature':
					temperature = data;
					break;
				case 'humidity':
					humidity = data;
					break;
				case 'pH':
					pH = humidity;
				default:
					break;
			}
		};
	});

	onDestroy(() => {
		eventSource?.close();
	});
</script>

<div class="list">
	<div class="card">
		<h3 class="m-0">Temperatura</h3>
		<span>{temperature?.timestamp || '--'}</span>
		<h1 class="m-0">{temperature?.value || '--'} {temperature?.unit || '--'}</h1>
	</div>
	<div class="card">
		<h3 class="m-0">Humedad</h3>
		<span>{humidity?.timestamp || '--'}</span>
		<h1 class="m-0">{humidity?.value || '--'} {humidity?.unit || '--'}</h1>
	</div>
	<div class="card">
		<h3 class="m-0">Temperatura</h3>
		<span>{pH?.timestamp || '--'}</span>
		<h1 class="m-0">{pH?.value || '--'} {pH?.unit || '--'}</h1>
	</div>
</div>

<style lang="scss">
	.list {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 0.5rem;

		.card {
			flex: 1;
			min-width: 200px;
			* {
				display: block;
			}
		}
	}
</style>

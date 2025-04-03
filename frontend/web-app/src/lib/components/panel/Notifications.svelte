<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { API_URL } from '../../../lib/config/config';

	let eventSource: EventSource | undefined = undefined;
	export let digitalTwinId: string;
	let data: any;

	onMount(() => {
		eventSource = new EventSource(
			`${API_URL}/enclosures/${digitalTwinId}/notifications`
		);

		eventSource.onerror = function (event) {
			console.log('error', event);
		};

		eventSource.onmessage = function (event) {
			data = JSON.parse(event.data);
		};
	});

	onDestroy(() => {
		eventSource?.close();
	});

	// On data change, set timeout to close
	$: if (data) {
		setTimeout(() => {
			data = undefined;
		}, 5000);
	}
</script>

<dialog open={!!data} class="card" on:click={() => (data = undefined)}>
	<h3 class="m-0 mb-4">
		<i class="fi fi-rr-bell" /> Nueva notificación - {data?.digitalTwinId}
	</h3>
	<p class="m-0">
		Tipo: {data?.type}<strong> - Prioridad: {data?.importance}</strong>
	</p>
	<span class="m-0">{data?.timestamp}</span>
	<h1>{Math.round(data?.value)}</h1>
</dialog>

<style lang="scss">
	.card {
		// Sex in the top left of the screen
		position: fixed;
		margin-left: 80px;
		top: 15px;
		z-index: 999;
		cursor: pointer;
		border: 3px solid rgb(161, 90, 39) !important;
		h1 {
			position: absolute;
			right: 15px;
			top: 35px;
		}
	}
</style>

<script lang="ts">
	import { page } from '$app/stores';
	import Chart from '$lib/components/panel/Chart.svelte';
	import Table from '$lib/components/panel/Table.svelte';
	import { digitalTwinsService } from '$lib/config/config';
	import { userEnclosures } from '$lib/config/stores/enclosures';
	import type { DigitalTwin, SimulationInfo } from '$lib/core/Domain';
	import simulation_example_img from '$lib/assets/simulation-example.jpg';
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let simulationId: string | null = $page.url.searchParams.get('simulationId');
	let digitalTwinId: string | undefined = $page.url.pathname.split('/').at(-1);
	let digitalTwin: DigitalTwin | undefined = undefined;
	let ws: WebSocket | undefined = undefined;
	let selectedSpeed: number = 1;
	let simulationStopped: boolean = false;
	let simulationPaused: boolean = true;
	let firstTime: boolean = true;
	let SimulationInfo: SimulationInfo | undefined = undefined;

	let digitalTwinStatus: any = null;
	let results: any[] = [];

	let initialParams = {
		startDate: '2021-01-01',
		endDate: '2021-12-31',
		numTrees: 100
	};

	onMount(() => {
		if (simulationId) {
			firstTime = false;
			simulationPaused = false;
		}
		// Websocket connection
		ws = new WebSocket('ws://localhost:8080/enclosures/simulations/status/ws');
		ws.onopen = () => {
			if (simulationId && digitalTwinId) {
				ws!.send(JSON.stringify({ digitalTwinId, simulationId }));
			}
			console.log('Connected to websocket');
		};
		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.type === 'status') {
				digitalTwinStatus = data.data;
			} else if (data.type === 'results') {
				results = data.data;
			}
		};
		ws.onclose = () => {
			console.log('Websocket closed');
		};
		ws.onerror = (error) => {
			console.error(error);
		};
	});

	onDestroy(() => {
		ws?.close();
		handleStopSimulation();
	});

	const handleStartSimulation = () => {
		if (!digitalTwinId) return;
		digitalTwinsService
			.createNewSimulation(
				digitalTwinId,
				new Date(initialParams.startDate),
				new Date(initialParams.endDate),
				initialParams.numTrees
			)
			.then((response) => {
				simulationId = response;
				firstTime = false;
				simulationPaused = false;
				simulationStopped = false;
				ws!.send(JSON.stringify({ digitalTwinId, simulationId: response }));
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const handleStartPauseSimulation = async () => {
		if (!digitalTwinId) return;
		if (simulationPaused) {
			if (firstTime) {
				handleStartSimulation();
				return;
			}
			digitalTwinsService.speedSimulation(digitalTwinId, simulationId!, selectedSpeed);
			simulationPaused = false;
		} else {
			try {
				await digitalTwinsService.speedSimulation(digitalTwinId, simulationId!, 0);
				simulationPaused = true;
			} catch (e) {
				simulationPaused = false;
			}
		}
	};

	const handleStopSimulation = async () => {
		if (simulationId && digitalTwinId) {
			await digitalTwinsService.stopSimulation(digitalTwinId, simulationId);
			simulationStopped = true;
			simulationPaused = true;
		}
	};

	const handleSpeedSimulation = async (speed: number) => {
		if (simulationId && digitalTwinId) {
			await digitalTwinsService.speedSimulation(digitalTwinId, simulationId, speed);
		}
	};

	const handleDeleteSimulation = async () => {
		if (simulationId && digitalTwinId) {
			try {
				await digitalTwinsService.deleteSimulation(digitalTwinId, simulationId);
				goto('/panel/simulations');
			} catch (error) {
				alert('Error al intentar eliminar la simulación');
			}
		}
	};

	$: digitalTwin = $userEnclosures.find((e) => e.id === digitalTwinId);
</script>

<h1>Simulación {digitalTwinId} - {simulationId}</h1>
<section class="container">
	<div class="start-stop" style="grid-area: start-button;">
		<button on:click={handleStartPauseSimulation}>
			<i class={`fi fi-rr-${simulationPaused ? 'play' : 'pause'}`}></i>
		</button>
		<button on:click={handleStopSimulation}>
			<i class="fi fi-rr-stop"></i>
		</button>
		<div class="button-group">
			{#each [0.25, 0.5, 1, 2, 4] as speed}
				<button
					class="selected"
					on:click={() => {
						selectedSpeed = speed;
						handleSpeedSimulation(speed);
					}}
					class:selected={selectedSpeed === speed}
					disabled={simulationPaused}
				>
					{speed}x
				</button>
			{/each}
		</div>
		<br />
		<button on:click={handleDeleteSimulation}>
			<i class="fi fi-rr-trash"></i>
		</button>
	</div>
	<div class="card" style="grid-area: initial-conditions;">
		<h3 class="m-0">Condiciones iniciales</h3>
		<form>
			<input type="date" bind:value={initialParams.startDate} />
			<input type="date" bind:value={initialParams.endDate} />
			<input type="number" bind:value={initialParams.numTrees} />
		</form>
	</div>
	<div
		class="card"
		style="grid-area: digital-twin-state; max-width: 100%; height: 500px; overflow: scroll;"
	>
		<h3 class="m-0">Estado del gemelo digital simulado</h3>
		<pre>
			<code>
				{JSON.stringify(digitalTwinStatus, null, '	')}
			</code>
		</pre>
	</div>
	<div class="card" style="grid-area: map">
		<img src={simulation_example_img} height="100%" width="100%" alt="Mapa" />
	</div>
	<div class="card" style="grid-area: charts;">
		<h3 class="m-0">Gráficas</h3>
		<div style="display:flex; flex-direction: row; flex-wrap: wrap; max-height: 200px">
			<div style="flex: 2; height: 200px;">
				<Chart
					data={{
						data: {
							datasets: [
								{
									type: 'bar',
									data: results?.map((r) => {
										return {
											x: r.date,
											y: r.harvestKg
										};
									}),
									label: 'NDVI',
									barPercentage: 0.3,
									// Color green
									backgroundColor: 'rgba(30, 200, 192, 0.6)'
								}
							]
						},
						options: {
							responsive: true,
							maintainAspectRatio: false,
							plugins: {
								title: {
									display: true,
									text: 'Cosechas simuladas',
									font: {
										size: 15
									}
								},
								legend: {
									display: false
								}
							}
						}
					}}
				/>
			</div>
			<!-- Pie chart -->
			<div style="flex: 1; height: 200px;">
				<Chart
					data={{
						type: 'doughnut',
						data: {
							labels: ['Red', 'Blue', 'Yellow'],
							datasets: [
								{
									label: 'My First Dataset',
									data: [300, 50, 100],
									backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
									hoverOffset: 4
								}
							]
						},
						options: {
							responsive: true,
							maintainAspectRatio: false
						}
					}}
				/>
			</div>
		</div>
	</div>
	<div class="card" style="grid-area: results;">
		<h3 class="m-0">Resultados</h3>
		<Table
			rows={results}
			columns={[
				{
					key: 'year',
					title: 'Fecha',
					value: (v) => v.date
				},
				{
					key: 'num_trees',
					title: 'Árboles',
					value: (v) => v.numTrees
				},
				{
					key: 'affected_trees',
					title: 'Árboles afectados',
					value: (v) => v.affectedTrees
				},
				{
					key: 'dead_trees',
					title: 'Árboles muertos',
					value: (v) => v.deadTrees
				},
				{
					key: 'yield',
					title: 'Yield',
					value: (v) => v.yield
				},
				{
					key: 'harvest',
					title: 'Cosecha (kg)',
					value: (v) => v.harvestKg
				}
			]}
		/>
	</div>
</section>

<style lang="scss">
	.container {
		display: grid;
		grid-template-areas:
			'start-button start-button'
			'initial-conditions digital-twin-state'
			'map digital-twin-state'
			'map charts'
			'results results';
		grid-template-columns: 1.2fr 1.5fr;
		gap: 1em;
	}

	.start-stop {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;

		i {
			font-size: 1rem;
		}
	}

	.header {
		display: flex;
		flex-wrap: wrap;
		column-gap: 0.5rem;
		align-items: center;
	}
</style>

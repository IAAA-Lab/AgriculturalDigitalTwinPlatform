<script lang="ts">
	import { digitalTwinsService } from '$lib/config/config';
	import { formattedTime } from '../../core/functions';
	export let digitalTwinId: string;
</script>

<section class="card">
	<h1>Comandos</h1>
	<button class="button button-primary" disabled>Generar un nuevo comando</button>
	<hr />
	<h3 class="m-0">Historial de comandos</h3>
	{#await digitalTwinsService.getCommands(digitalTwinId)}
		Nada por aquí ...
	{:then commmands}
		<div class="commands-scroll">
			{#each commmands as command}
				<div class="card-inner">
					<h3 class="m-0">
						{command.type.toUpperCase()} - {command.automated ? 'Automático' : 'Manual'}
					</h3>
					<p class="m-0"><strong>{command.Timestamp.substring(0, 16).replace('T', ' ')}</strong></p>
					<p class="m-0">Acción: {command.action}</p>
					<p class="m-0">Durante: {command.duration} horas</p>
					<p class="m-0">
						Quedan: {new Date(command.Timestamp).getHours() - command.duration} horas
					</p>
					<div
						class="badge"
						style="background-color: {new Date(command.Timestamp).getHours() - command.duration > 0
							? '#88e4ff'
							: '#88ffc7'}"
					>
						{new Date(command.Timestamp).getHours() - command.duration > 0
							? 'Pendiente'
							: 'Completado'}
					</div>
					<h2 class="m-0">{command.value.toFixed(2)} {command.unit}</h2>
				</div>
			{/each}
		</div>
	{/await}
</section>

<style lang="scss">
	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		max-height: 75vh;
	}

	.card-inner {
		width: 90%;
		position: relative;
	}

	.commands-scroll {
		overflow: scroll;
		width: 100%;
		display: grid;
		row-gap: 0.5rem;
		justify-items: center;
	}

	hr {
		width: 80%;
	}

	h2 {
		position: absolute;
		top: 50px;
		right: 20px;
		margin: 0;
	}

	.badge {
		font-size: 15px;
		position: absolute;
		top: 80px;
		right: 10px;
	}
</style>

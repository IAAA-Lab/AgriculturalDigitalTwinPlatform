<script lang="ts">
	export let phase: string = '';
	export let date: string = '';
	export let numExpte: string = '';

	const logosPath = [
		{ name: 'AEI Clúster', src: 'logo-AEI-cluster.jpg', width: 250 },
		{ name: 'NextGenerationEU', src: 'NExtGen.jfif', width: 300 },
		{
			name: 'Ministerio de Industria y Comercio',
			src: 'Logo-Gobierno-MINCOTUR-DGIPYME.jpg',
			width: 400
		},
		{
			name: 'Plan de Recuperación, Transformación y Resiliencia',
			src: 'logo-planrecuperacion.jpg',
			width: 300
		}
	];
</script>

<section class="container-sm has-bottom-divider">
	<div class="container-xs">
		<h2 class="mb-16 reveal-from-bottom" data-reveal-delay="100">Financiación</h2>
		<p class="m-0">
			El proyecto GEDEFEC {phase} está apoyado por la convocatoria de octubre de {date}, de apoyo a
			AAEEII del Ministerio de Industria, Comercio y Turismo, financiada por la Unión Europea – Next
			Generation EU (Nº Expte: {numExpte}).
		</p>
	</div>
	<div class="financing-wrap">
		{#each logosPath as logo, i}
			<div class="reveal-from-bottom" data-reveal-delay={`${i * 50}`}>
				<img src={`${logo.src}`} alt={logo.name} width={logo.width} />
			</div>
		{/each}
	</div>
</section>

<style lang="scss">
	section {
		display: grid;
		place-items: center;
		text-align: center;
		margin-top: 2rem;
		padding: 0 1rem;

		.financing-wrap {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			align-items: center;
			column-gap: 2rem;
			row-gap: 1rem;
			margin: 3rem 0;

			img {
				max-width: 100%;
			}
		}
	}
</style>

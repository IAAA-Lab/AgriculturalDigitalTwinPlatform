<script>
	import Financing from './financing.svelte';
	import Goals from './goals.svelte';
	import Partnership from './partnership.svelte';
	import PhasesNavBar from './phasesNavBar.svelte';

	let selectedPhase = 0;

	const phases = [
		{
			title: 'Fase 1',
			date: '2021',
			code: 'AEI-010500-2021b-122',
			stateKey: 'under-construction',
			state: 'Bajo construcción',
			illustration: 'feature-tile-icon-02.svg',
			objectives: [
				{
					title: 'Modelo de datos consistente',
					paragraph: 'Obtener un modelo de datos que sustente el desarrollo del gemelo digital.'
				},
				{
					title: 'Identificación de los datos',
					paragraph: 'Identificar los datos necesarios para el desarrollo del gemelo digital.'
				},
				{
					title: 'Funcionalidades',
					paragraph: 'Especificar las funcionalidades que debe tener el gemelo digital.'
				},
				{
					title: 'Primer demostrador',
					paragraph:
						'Contar con un primer demostrador alimentado con datos de una explotación real que sirva de base para las siguientes fases.'
				}
			],
			partners: [
				{ path: 'virtalis-logo.png', link: 'https://www.vitartis.es/' },
				{ path: '7edata-logo.png', link: 'https://www.7edata.com/' },
				{
					path: 'agrointelligent-logo.webp',
					link: 'https://www.agrointelligent.com/'
				},
				{ path: 'geoslab-logo.png', link: 'https://www.geoslab.com/' },
				{ path: 'campg-logo.png', link: 'https://campag.es/' },
				{ path: 'pystacil-logo.png', link: 'https://pistacyl.com/' },
				{ path: 'cetemet-logo.png', link: 'https://cetemet.es/' }
			]
		},
		{
			title: 'Fase 2',
			date: '2022',
			code: 'AEI-010500-2022b-61',
			illustration: 'feature-tile-icon-04.svg',
			stateKey: 'under-construction',
			state: 'Bajo construcción',
			objectives: [
				{
					title: 'Análisis el mercado',
					paragraph:
						'Identificar y caracterizar todas las soluciones de mercado existentes capaces de aportar automatismos a la entrada de datos al gemelo.'
				},
				{
					title: 'Análisis de sensórica',
					paragraph:
						'Establecer los sensores con los que se trabajará a nivel de prototipo demostrador y fijar las características de los datos que se recopilarán.'
				},
				{
					title: 'Integración de datos de sensores',
					paragraph:
						'Definir la arquitectura software para la integración de los datos procedentes de los sensores seleccionados.'
				},
				{
					title: 'Relaciones de realimentación',
					paragraph:
						'Identificar y caracterizar todas las relaciones de realimentación que sobre la explotación tienen los productos resultantes de los procesos de salida de la misma.'
				},
				{
					title: 'Creación de algoritmos',
					paragraph: 'Diseñar y construir los algoritmos de cálculo de estas relaciones.'
				},
				{
					title: 'Integración de algoritmos',
					paragraph:
						'Definir la arquitectura software para la integración de los algoritmos de cálculo desarrollados en el prototipo de gemelo.'
				},
				{
					title: 'Segundo demostrador',
					paragraph:
						'Disponer de una segunda implementación del sistema de información que constituye en gemelo digital.'
				}
			],
			partners: [
				{ path: '7edata-logo.png', link: 'https://www.7edata.com/' },
				{
					path: 'agrointelligent-logo.webp',
					link: 'https://www.agrointelligent.com/'
				},
				{ path: 'geoslab-logo.png', link: 'https://www.geoslab.com/' },
				{ path: 'campg-logo.png', link: 'https://campag.es/' },
				{ path: 'pystacil-logo.png', link: 'https://pistacyl.com/' },
				{ path: 'cetemet-logo.png', link: 'https://cetemet.es/' }
			]
		}
	];
</script>

<section id="phases">
	<PhasesNavBar {phases} bind:selectedPhase />
	<Goals
		goals={phases[selectedPhase].objectives}
		illustration={phases[selectedPhase].illustration}
		phase={phases[selectedPhase].title}
	/>
	<Partnership partners={phases[selectedPhase].partners} phase={phases[selectedPhase].title} />
	<Financing
		numExpte={phases[selectedPhase].code}
		phase={phases[selectedPhase].title}
		date={phases[selectedPhase].date}
	/>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		margin-top: 6rem;
	}
</style>

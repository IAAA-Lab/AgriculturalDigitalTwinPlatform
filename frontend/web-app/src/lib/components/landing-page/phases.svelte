<script>
	const sectionHeader = {
		title: 'Fases del proyecto',
		paragraph: 'Trataremos de tres fases principales para el desarrollo del gemelo digital.'
	};
</script>

<section>
	<div class="container-sm has-bottom-divider">
		<div class="phases-inner">
			<div class="container-xs">
				<h2 class="mt-0 mb-16 reveal-from-bottom" data-reveal-delay="100">
					{sectionHeader.title}
				</h2>
				<p class="m-0">{sectionHeader.paragraph}</p>
			</div>
			<div class="split-wrap">
				<div class="split-item">
					<div class="split-item-content reveal-from-left" data-reveal-container=".split-item">
						<div class="text-sm text-color-primary fw-600 tt-u mb-8">Fase 1</div>
						<h3 class="mt-0 mb-12">Modelo e identificación de datos</h3>
						<p class="m-0">
							Elaboración del diseño de un modelo de datos que sustente el desarrollo del gemelo
							digital y en especificar las funciones que este gemelo debería ser capaz de aportar
							para ser útil al sector
						</p>
					</div>
					<div
						class="split-item-image reveal-from-left split-item-image-fill"
						data-reveal-container=".split-item"
					>
						<img loading="lazy" src={'fase_1_1.jpg'} alt="Features split 01" class="has-shadow" />
					</div>
				</div>

				<div class="split-item">
					<div
						class="split-item-content reveal-from-right split-item-image-fill"
						data-reveal-container=".split-item"
					>
						<div class="text-sm text-color-primary fw-600 tt-u mb-8">Fase 2</div>
						<h3 class="mt-0 mb-12">Automatización y realimentación</h3>
						<p class="m-0">
							Estudio de cuáles son las relaciones que se establecen en la operativa de una parcela
							en una campaña con respecto a las siguientes. De este modo, se pretende consolidar y
							sistematizar el conocimiento popular que determina que lo que le hagas a una parcela
							hoy va a influir en sus rendimientos a medio y largo plazo.
						</p>
					</div>
					<div
						class="split-item-image reveal-from-left split-item-image-fill"
						data-reveal-container=".split-item"
					>
						<img loading="lazy" src={'fase_1_2.webp'} alt="Features split 02" class="has-shadow" />
					</div>
				</div>

				<div class="split-item">
					<div class="split-item-content reveal-from-left" data-reveal-container=".split-item">
						<div class="text-sm text-color-primary tt-u fw-600 mb-8">Fase 3</div>
						<h3 class="mt-0 mb-12">Red de gemelos</h3>
						<p class="m-0">
							Ánálisis de las relaciones entre las diversas parcelas colindantes con vistas a
							determinar cómo impactan sobre la explotación que sea objeto de estudio.
							Posteriormente se llevará a cabo la introducción de sistemas de inteligencia
							artificial que serán capaces de hacer los pronósticos de comportamiento de la
							explotación.
						</p>
					</div>
					<div
						class="split-item-image reveal-from-bottom split-item-image-fill"
						data-reveal-container=".split-item"
					>
						<img loading="lazy" src={'fase_1_3.jpg'} alt="Features split 03" class="has-shadow" />
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style lang="scss">
	section {
		text-align: center;
		display: grid;
		place-items: center;
		margin-top: 5rem;
		background: url('/illustration-section-02.svg') no-repeat right top 500px;

		.phases-inner {
			display: grid;
			place-items: center;
		}

		.split-wrap {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 2.5rem;
			padding: 3rem 1rem;
			.split-item {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				align-items: center;
				justify-content: center;
				column-gap: 2.5rem;

				&:nth-child(even) {
					flex-direction: row-reverse;
				}

				.split-item-content {
					flex: 1;
					min-width: 225px;
					padding: 35px 0;
					text-align: left;
				}

				.split-item-image {
					min-width: 200px;
					flex: 1;
				}
			}
		}
	}

	img {
		width: 100%;
		aspect-ratio: 3/2;
		object-fit: cover;
		// Add shadows to create the "card" effect
		box-shadow: color-bg(shadow);
		border-radius: 7px;
	}

	@include media('<medium') {
		.split-wrap {
			gap: 0 !important;
		}
		.split-item-content {
			text-align: center !important;
		}
	}
</style>

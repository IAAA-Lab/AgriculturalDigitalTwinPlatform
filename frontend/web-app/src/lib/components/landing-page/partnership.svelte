<script lang="ts">
	export let partners: any[] = [];
	export let phase: string = '';
</script>

<section>
	<div class="container-sm reveal-from-bottom" data-reveal-delay="150" data-reveal-offset="250">
		<div class="features-tiles-inner section-inner has-bottom-divider">
			<div class="container-xs">
				<h2 class="mt-0 mb-16 reveal-from-bottom" data-reveal-delay="100">Socios</h2>
				<p class="m-0">
					El consorcio que lleva a cabo la {phase} del proyecto está formado por las siguientes entidades.
				</p>
			</div>
			<div class="tiles-wrap">
				{#each partners as { path, link }, i}
					<a style="border: none;" href={link} rel="noreferrer" target="_blank">
						<div class="img-wrapper">
							<img
								loading="lazy"
								alt={link}
								style="object-fit: contain;"
								src={`${path}`}
								width={175}
								height={150}
							/>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</div>
</section>

<style lang="scss">
	section {
		display: grid;
		place-items: center;
		text-align: center;
		margin-top: 4rem;

		.features-tiles-inner {
			padding-top: 0;
			display: grid;
			place-items: center;
		}

		.tiles-wrap {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			align-items: center;
			column-gap: 2rem;
			row-gap: 1rem;
			margin-top: 3rem;
			margin-bottom: 6rem;

			.img-wrapper {
				background-color: color-bg(body);
				padding: 1rem;
				border-radius: 0.5rem;

				&:hover {
					transition: all 0.2s ease-in-out;
					box-shadow: 0 0 0 0.2rem rgba(0, 0, 0, 0.1), color-bg(shadow-light);
				}
			}
		}
	}

	@include media('<medium') {
		section {
			.tiles-wrap {
				img {
					width: 150px;
					height: 125px;
				}
			}
		}
	}
</style>

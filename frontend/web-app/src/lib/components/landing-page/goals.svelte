<script lang="ts">
	export let goals: any[] = [];
	export let illustration: string = '';
	export let phase: string = '';
</script>

<section class="container-sm has-bottom-divider" data-reveal-delay="150" data-reveal-offset="200">
	<div class="container-xs">
		<h2 class="mb-16 reveal-from-bottom" data-reveal-delay="100">Objetivos</h2>
		<p class="m-0">Los objetivos de la {phase} son los que se muestran a continuación.</p>
	</div>
	<div class="goals-wrapper">
		{#each goals as item}
			<div class="goal-item">
				<div class="goal-item-inner">
					<div class="features-tiles-item-header">
						<div class="goal-item-icon mb-16">
							<img src={`${illustration}`} alt="Features tile icon 01" width={50} height={50} />
						</div>
					</div>
					<div class="goal-item-content">
						<h4 class="mt-0 mb-8">{item.title}</h4>
						<p class="m-0 text-xs">{item.paragraph}</p>
					</div>
				</div>
			</div>
		{/each}
	</div>
</section>

<style lang="scss">
	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;

		h2 {
			margin-top: 4rem;
		}
	}

	.goals-wrapper {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 1.5rem;
		margin: 3rem 0;

		.goal-item {
			flex-basis: 200px;
			min-height: 300px;
			padding: 1.8rem;
			box-sizing: content-box;
			background-color: color-bg(body);
			border: 2px solid color(primary);
			border-radius: 6px;

			&:hover {
				transition: all 0.2s ease !important;
				box-shadow: color-bg(shadow-light);
			}

			.goal-item-inner {
				display: flex;
				flex-direction: column;
				align-items: center;
				height: 100%;

				h4 {
					word-break: keep-all;
				}
			}

			.goal-item-icon {
				width: 50px;
				height: 50px;
				border-radius: 7px;
				background-color: color(primary);
			}
		}
	}
</style>

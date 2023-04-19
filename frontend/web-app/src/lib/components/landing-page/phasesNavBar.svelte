<script lang="ts">
	export let selectedPhase = 0;
	export let phases: any[] = [];

	const scrollIntoView = ({ target }: any, i: number) => {
		const el = document.querySelector(target.getAttribute('href'));
		if (!el) return;
		selectedPhase = i;
		el.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
			inline: 'start'
		});
	};
</script>

<nav>
	<ul>
		{#each phases as phase, i}
			<a
				class="m-0 fw-700"
				href="#phases"
				class:active={i === selectedPhase}
				on:click|preventDefault={(target) => scrollIntoView(target, i)}>{phase.title}</a
			>
		{/each}
	</ul>
</nav>

<style lang="scss">
	nav {
		position: sticky !important;
		top: 0;
		z-index: 10;
		width: 80%;
		background-color: color(primary);
		border-radius: 6px;
		padding: 0 1rem;
		ul {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			column-gap: 2rem;
			align-items: center;
			list-style: none;
			padding: 10px;
			margin: 0;

			a {
				margin: 0.5rem;
				padding: 0.4rem 0rem;
				transition: all 0.3s ease-in-out;
				color: beige !important;
				white-space: nowrap;
				width: 200px;

				&.active {
					background-color: white;
					border-radius: 8px;
					padding: 0.4rem 1.25rem;
					color: color(base) !important;
				}

				&:not(.active):hover {
					color: black;
				}
			}
		}
	}

	@include media('<medium') {
		nav {
			width: 100%;
			padding: 0;
			border-radius: 0;
			li {
				width: 100%;
			}
		}
	}
</style>

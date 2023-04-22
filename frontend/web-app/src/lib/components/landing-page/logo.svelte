<script>
	export let light = false;
</script>

<a href="/">
	<div class="brand">
		<img src={light ? '/logo-light.svg' : '/logo.svg'} alt="GEDEFEC" width={60} />
		<p class="m-0 ml-8 text-sm" style={'--color-text: ' + (light ? 'white' : 'black')}>GEDEFEC</p>
	</div>
</a>

<style lang="scss">
	.brand {
		display: flex;
		align-items: center;

		p {
			font-weight: 700;
			color: var(--color-text, color(text));
		}
	}

	.brand img {
		margin-right: 0.25rem;
	}
</style>

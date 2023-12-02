<script>
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={scrollToTop}>
	<i class="fi fi-ts-arrow-circle-up" />
</div>

<style lang="scss">
	div {
		@include media('<small') {
			display: none;
		}
		color: color(primary);
		position: fixed;
		bottom: 20px;
		right: 20px;
		z-index: 30;
		cursor: pointer;
		width: 50px;
		height: 50px;
		transition: scale 0.2s ease-in-out;
		&:hover {
			scale: 1.2;
		}

		// Change size of icon
		i {
			font-size: 50px;
		}
	}
</style>

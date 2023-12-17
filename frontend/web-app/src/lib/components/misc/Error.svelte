<script>
	export let errorMessage = '';
</script>

<div class="error__wrapper">
	<div class="error">
		<i class="fi fi-rr-exclamation" />
		<p class="m-0 text-m"><strong>ERROR</strong></p>
		<p class="m-0 text-xs">{errorMessage}</p>
	</div>
</div>

<style>
	.error__wrapper {
		display: grid;
		place-items: center;
		height: 100%;
		width: 100%;
	}

	p,
	i {
		color: white;
		text-align: center;
	}

	.error {
		border: 3px solid rgb(248, 225, 229);
		border-radius: 10px;
		padding: 15px;
		display: grid;
		place-items: center;
		background-color: crimson;
	}
</style>

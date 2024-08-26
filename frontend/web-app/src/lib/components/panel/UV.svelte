<script lang="ts">
</script>

<div class="card">
	<div class="header">
		<i class="fi fi-rr-sun" />
		<p class="m-0">UV</p>
	</div>
	<input type="range" min="0" max="10" value="1" />
	<p class="text-m m-0"><strong>1</strong></p>
</div>

<style lang="scss">
	.card {
		display: flex;
		flex-direction: column;
		row-gap: 0.5rem;
		width: 200px;
		height: min-content;
	}

	input[type='range'] {
		-webkit-appearance: none;
		appearance: none;
		height: 15px;
		border-radius: 5px;
		background: linear-gradient(
			90deg,
			rgba(255, 0, 0, 1) 0%,
			rgba(255, 154, 0, 1) 10%,
			rgba(208, 222, 33, 1) 20%,
			rgba(79, 220, 74, 1) 30%,
			rgba(63, 218, 216, 1) 40%,
			rgba(47, 201, 226, 1) 50%,
			rgba(28, 127, 238, 1) 60%,
			rgba(95, 21, 242, 1) 70%,
			rgba(186, 12, 248, 1) 80%,
			rgba(251, 7, 217, 1) 90%,
			rgba(255, 0, 0, 1) 100%
		);
		outline: none;
		width: 100%;
	}

	.header {
		display: flex;
		flex-direction: row;
		column-gap: 0.75rem;

		p {
			color: rgb(78, 78, 78);
		}
	}
</style>

<script lang="ts">
	export let title: string;
</script>

<div class="stat">
	<div class="header">
		<slot name="header-icon" />
		<p class="text-xs m-0 ml-4">{title}</p>
	</div>
	<div class="p-4">
		<slot name="body" />
	</div>
</div>

<style>
	.stat {
		background: #e2e7ee;
		border: 1px solid #ffffff;
		border-radius: 10px;
		height: 100%;
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		padding: 5px;
		color: grey;
	}
</style>

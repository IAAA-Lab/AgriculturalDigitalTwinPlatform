<script lang="ts">
	import clickOutside from 'svelte-outside-click';

	export let items: any[] = [];
	let show = false;

	const toggleDropdown = () => {
		show = !show;
	};
</script>

<div class="dropdown" use:clickOutside={() => (show = false)}>
	<div class="dropdown-toggle" id="dropdownMenuButton" on:click={toggleDropdown}>
		<slot />
	</div>
	<div class="dropdown-menu mt-8" class:visible={show}>
		{#each items as item}
			<p class="dropdown-item text-xs m-0" on:click={item.action}>{item.text}</p>
		{/each}
	</div>
</div>

<style lang="scss">
	.dropdown {
		position: relative;
		display: inline-block;
	}

	.dropdown-toggle {
		cursor: pointer;
	}

	.dropdown-menu {
		display: none;
		position: absolute;
		right: 0;
		background-color: #f9f9f9;
		min-width: 100px;
		box-shadow: color-bg(shadow-light);
		z-index: 1;
		padding: 0.2rem 0;
		border: solid 2px grey;
		border-radius: 5px;

		&.visible {
			display: block;
		}
	}

	.dropdown-menu a {
		color: black;
		padding: 0 0.2rem;
		text-decoration: none;
		display: block;
	}

	.dropdown-item {
		cursor: pointer;
		padding: 0 0.2rem;
		transition: all 0.2s ease-out;
	}
</style>

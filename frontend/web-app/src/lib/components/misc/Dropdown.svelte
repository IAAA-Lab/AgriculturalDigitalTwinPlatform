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
			<div class="dropdown-item" on:click={item.action}>{item.text}</div>
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
		min-width: 160px;
		box-shadow: color-bg(shadow-light);
		z-index: 1;
		padding: 0.5rem 0;
		border: solid 2px grey;
		border-radius: 5px;

		&.visible {
			display: block;
		}
	}

	.dropdown-menu a {
		color: black;
		padding: 12px 16px;
		text-decoration: none;
		display: block;
	}

	.dropdown-item {
		cursor: pointer;
		padding: 0.25rem 0.5rem;
		transition: all 0.2s ease-out;
	}
</style>

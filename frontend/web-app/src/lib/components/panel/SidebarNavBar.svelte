<script>
	import { tabs } from '$lib/config/constants';
	import SidebarOption from './SidebarOption.svelte';
	import { page } from '$app/stores';
</script>

<nav>
	<ul>
		{#each tabs as tab}
			<li>
				<a href={tab.path}>
					<SidebarOption text={tab.label} selected={$page.url.pathname === tab.path}>
						{@html tab.icon}
					</SidebarOption>
				</a>
			</li>
		{/each}
	</ul>
</nav>

<style lang="scss">
	nav {
		white-space: nowrap;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		ul {
			list-style: none;
			margin: 0;
			padding: 0;
			li {
				padding: 7px;
			}
		}
	}
</style>

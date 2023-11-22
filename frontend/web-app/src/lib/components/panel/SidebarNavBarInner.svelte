<script lang="ts">
	import { tabsInner } from '$lib/config/constants';
	import SidebarOption from './SidebarOption.svelte';
	import { page } from '$app/stores';
	import { selectedEnclosure } from '$lib/config/stores/enclosures';
</script>

<nav>
	<ul>
		{#each tabsInner as tab}
			<li>
				<a href={`${tab.path}?enclosureId=${$selectedEnclosure}`}>
					<SidebarOption text={tab.label} selected={tab.regex.test($page.url.pathname)}>
						{@html tab.icon}
					</SidebarOption>
				</a>
			</li>
		{/each}
	</ul>
</nav>

<style lang="scss">
	nav {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-start;
		white-space: nowrap;

		ul {
			list-style: none;
			margin: 0;
			padding: 0;
			li {
				padding: 3px;
			}
		}
	}
</style>

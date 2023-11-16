<script lang="ts">
	import { tabs } from '$lib/config/constants';
	import Footer from './Footer.svelte';
	import LogoText from './LogoText.svelte';
	import SidebarNavBar from './SidebarNavBar.svelte';
	import SidebarNavBarInner from './SidebarNavBarInner.svelte';
	import { page } from '$app/stores';

	// Get path without basepath
	let show = true;
	$: show = tabs.find((tab) => tab.path === $page.url.pathname) ? true : false;
</script>

<div class="sidebar-wrapper">
	<aside class="sidebar" class:collapsed={!show}>
		<LogoText />
		<SidebarNavBar />
		<Footer />
	</aside>
	<aside class="inner-sidebar" class:active={show}>
		<SidebarNavBarInner />
	</aside>
</div>

<style lang="scss">
	.sidebar-wrapper {
		display: flex;
		flex-direction: row;
		position: -webkit-sticky;
		position: sticky;
		top: 0;
		height: 100vh;
		overflow: hidden;
		grid-area: sidebar;
	}
	aside {
		margin-left: 10px;
		&.inner-sidebar {
			padding-top: 4.7rem;
			background-color: #ecddd3;
			padding-right: 20px;
			padding-left: 10px;
			height: 100%;
		}
	}

	@include media('<large') {
		:global(*) {
			.sidebar {
				.sidebar-option-text,
				h3 {
					display: none;
				}
			}
		}
	}

	:global(.sidebar) {
		&.collapsed {
			padding: 0px !important;
			.sidebar-option-text,
			h3 {
				display: none;
			}
		}
	}

	.inner-sidebar {
		&.active {
			display: none;
		}
	}
</style>

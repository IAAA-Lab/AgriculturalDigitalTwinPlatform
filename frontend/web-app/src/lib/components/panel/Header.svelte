<script>
	import { page } from '$app/stores';
	import SummaryPopup from './SummaryPopup.svelte';
	import UserOptions from './UserOptions.svelte';
</script>

<header class="ml-16">
	<nav>
		<ul>
			{#if $page.url.pathname === '/panel'}
				<li class="mt-8">
					<SummaryPopup />
				</li>
			{/if}
			<li class="mt-8">
				<i class="fi fi-rr-bell" />
			</li>
			<li>
				<UserOptions />
			</li>
		</ul>
	</nav>
</header>

<style lang="scss">
	header {
		grid-area: header;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: flex-end;
		align-items: center;
		padding-top: 16px;

		nav {
			ul {
				display: flex;
				align-items: center;
				list-style: none;
				margin: 0;
				padding: 5px;

				li {
					margin-right: 1rem;
				}
			}
		}
	}

	@include media('<large') {
		:global {
			header {
				h1,
				.user-options {
					display: none;
				}
				.summary-icon,
				.user-menu {
					display: block !important;
				}
			}
		}
	}
</style>

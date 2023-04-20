<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Logo from './logo.svelte';
	import Hamburger from '../misc/Hamburger.svelte';
	import clickOutside from 'svelte-outside-click';

	let isActive = true;

	const scrollIntoView = ({ target }: any) => {
		const el = document.querySelector(target.getAttribute('href'));
		if (!el) return;
		el.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
			inline: 'start'
		});
		closeMenu();
	};

	const toggleMenu = () => {
		isActive = !isActive;
	};

	const closeMenu = () => {
		console.log(isActive);
		isActive = false;
	};
</script>

<header class="site-header">
	<div class="container">
		<div class="site-header-inner">
			<Logo />
			<div use:clickOutside={closeMenu} class="header-nav-toggle" on:click={toggleMenu}>
				<Hamburger open={isActive} />
			</div>
			<nav class="header-nav" class:is-active={isActive}>
				<div class="header-nav-inner">
					<ul class="list-reset header-nav-right">
						{#if $page.url.pathname === '/'}
							<li>
								<a class="m-0 fw-700" href="#phases" on:click|preventDefault={scrollIntoView}
									>Fases</a
								>
							</li>
						{/if}
						<li>
							<a class="m-0 fw-700" href="/blog">Noticias</a>
						</li>
						{#if $page.url.pathname === '/'}
							<li>
								<a class="m-0 fw-700" href="#contact" on:click|preventDefault={scrollIntoView}
									>Contacto</a
								>
							</li>
						{/if}
						<li>
							<a href="/panel" class="button-primary button" on:click={() => closeMenu()}>
								Accede
							</a>
						</li>
					</ul>
				</div>
			</nav>
		</div>
	</div>
</header>

<style lang="scss">
	.site-header {
		background: rgba(255, 255, 255, 0.9);
		display: grid;
		place-items: center;

		.container {
			width: 90%;
			padding-top: 0.5rem;
		}

		.brand {
			color: black !important;
			font-weight: 700 !important;
		}
	}

	.site-header-inner {
		display: flex;
		justify-content: space-between;
		align-items: center;
		column-gap: 1rem;
	}

	.header-nav {
		flex-grow: 1;

		.header-nav-inner {
			display: flex;
			flex-grow: 1;
		}

		ul {
			display: flex;
			align-items: center;
			flex-grow: 1;
			white-space: nowrap;
			flex-wrap: nowrap !important;

			&:first-of-type {
				flex-wrap: wrap;
			}
		}

		li {
			margin-left: 3rem;
		}

		a:not(.button) {
			display: block;
			cursor: pointer;
			@include anchor-aspect(header);
			@include font-weight(header-link);
		}
	}

	.header-nav-center:first-of-type {
		flex-grow: 1;
		justify-content: flex-end;
	}

	.header-nav-right {
		justify-content: flex-end;

		+ .header-nav-right {
			flex-grow: 0;
		}
	}

	.header-nav-toggle {
		display: none;
	}

	@include media('<=medium') {
		.header-nav-toggle {
			display: block;
			// Header navigation when the hamburger is a previous sibling
			+ .header-nav {
				background: color-bg(footer);
				position: absolute;
				left: 0;
				right: 0;
				top: 70px;
				z-index: 100000;
				max-height: 0;
				opacity: 0;
				overflow: hidden;
				transition: max-height 0.5s ease-in-out, opacity 0.15s;
				row-gap: 1rem;

				&.is-active {
					opacity: 1;
					max-height: 500px;
				}

				ul {
					display: block;
					text-align: center;

					li {
						margin: 0;
					}

					a:not(.button) {
						cursor: pointer;
						display: inline-flex;
						@include anchor-aspect(header-mobile);
						padding: 0.25rem 0 !important;
					}
				}
			}
		}
	}
</style>

<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Logo from './logo.svelte';

	let nav: any = null;
	let isActive = false;
	let hamburger: any = null;

	const clickOutside = (e: any) => {
		if (!nav) return;
		if (!isActive || nav.contains(e.target) || e.target === hamburger) return;
		closeMenu();
	};

	onMount(() => {
		document.addEventListener('click', clickOutside);
	});

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

	const openMenu = () => {
		document.body.classList.add('off-nav-is-active');
		if (!nav) return;
		nav.style.maxHeight = nav.scrollHeight + 'px';
		isActive = true;
	};

	const closeMenu = () => {
		document.body.classList.remove('off-nav-is-active');
		if (!nav) return;
		nav && (nav.style.maxHeight = null);
		isActive = false;
	};
</script>

<header class="site-header">
	<div class="container">
		<div class="site-header-inner">
			<Logo />
			<div
				class="header-nav-toggle"
				bind:this={hamburger}
				on:click={isActive ? closeMenu : openMenu}
			>
				<!-- <span class="screen-reader">Menu</span> -->
				<span class="hamburger">
					<span class="hamburger-inner" />
				</span>
			</div>
			<nav class="header-nav" bind:this={nav} class:is-active={isActive}>
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
				z-index: 9999;
				max-height: 0;
				opacity: 0;
				overflow: hidden;
				transition: max-height 0.25s ease-in-out, opacity 0.15s;
				row-gap: 1rem;

				&.is-active {
					opacity: 1;
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
	.hamburger,
	.hamburger-inner {
		display: block;
		pointer-events: none;
	}

	.hamburger {
		position: relative;
		width: 50px;
		height: 50px;
	}

	.hamburger-inner,
	.hamburger-inner::before,
	.hamburger-inner::after {
		width: 50px;
		height: 50px;
		position: absolute;
		background: color-icon(hamburger);
		border-radius: 7px;
	}

	.hamburger-inner {
		transition-duration: 0.22s;
		transition-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);

		&::before,
		&::after {
			content: '';
			display: block;
		}

		&::before {
			top: 5px;
			transition: top 0.1s 0.25s ease-in, opacity 0.1s ease-in;
		}

		&::after {
			bottom: 5px;
			transition: bottom 0.1s 0.25s ease-in, transform 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19),
				width 0.1s 0.25s ease-in;
		}

		.off-nav-is-active & {
			transform: rotate(225deg);
			transition-delay: 0.12s;
			transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);

			&::before {
				top: 0;
				opacity: 0;
				transition: top 0.1s ease-out, opacity 0.1s 0.12s ease-out;
			}

			&::after {
				width: 5px;
				bottom: 0;
				transform: rotate(-90deg);
				transition: bottom 0.1s ease-out, transform 0.22s 0.12s cubic-bezier(0.215, 0.61, 0.355, 1),
					width 0.1s ease-out;
			}
		}
	}
</style>

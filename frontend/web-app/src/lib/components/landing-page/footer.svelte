<script>
	import Logo from './logo.svelte';
</script>

<footer class="site-footer center-content-mobile has-top-divider">
	<div class="ml-16 mr-16">
		<div class="site-footer-inner pt-32">
			<Logo light={true} />
			<div class="footer-bottom space-between text-xxs invert-order-desktop mt-16">
				<p class="footer-copyright text-xs">Copyright © 2022 - 2023 · GEDEFEC</p>
			</div>
		</div>
	</div>
</footer>

<style lang="scss">
	.site-footer {
		position: relative;
		height: 100%;

		&::before {
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: color-bg(footer);
			z-index: -3;
			content: '';
		}
	}

	@include media('<medium') {
		.footer-bottom {
			&.space-between {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
		}

		.footer-bottom {
			&.invert-order-desktop {
				> *:first-child {
					order: 1;
				}
			}
		}
	}
</style>

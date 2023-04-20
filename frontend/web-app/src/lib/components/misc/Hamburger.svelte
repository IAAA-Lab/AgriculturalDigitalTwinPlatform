<script>
	export let open = false;
</script>

<span class="menu hamburger" class:open>
	<div class="icon" />
</span>

<style lang="scss">
	$color: color(base);

	@mixin icon($height, $width) {
		transition-duration: 0.25s;
		position: absolute;
		height: $height;
		width: $width;
		top: 30px;
		background-color: $color;
	}

	@mixin icon-before($height, $width, $top) {
		transition-duration: 0.25s;
		position: absolute;
		width: $width;
		height: $height;
		background-color: $color;
		content: '';
		top: $top;
	}

	@mixin icon-after($height, $width, $top) {
		transition-duration: 0.25s;
		position: absolute;
		width: $width;
		height: $height;
		background-color: $color;
		content: '';
		top: $top;
	}

	.hamburger {
		z-index: 9999;
		cursor: pointer;
		padding: 0.5rem;

		.icon {
			@include icon(3px, 25px);
			border-radius: 4px;

			&:before {
				@include icon-before(3px, 25px, -8px);
				border-radius: 4px;
			}

			&:after {
				@include icon-after(3px, 25px, 8px);
				border-radius: 4px;
			}
		}

		&.open {
			.icon {
				transition-duration: 0.25s;
				background: transparent;

				&:before {
					transform: rotateZ(45deg) scaleX(1) translate(6.5px, 6.5px);
				}

				&:after {
					transform: rotateZ(-45deg) scaleX(1) translate(5px, -5px);
				}
			}
		}
	}
</style>

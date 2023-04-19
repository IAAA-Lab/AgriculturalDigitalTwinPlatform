<script>
	import { page } from '$app/stores';
</script>

<section>
	<h1 class="m-0 mb-16">Error {$page.status} - {$page.error?.message}</h1>
	<a href="/">Volver a <strong>Inicio</strong></a>
</section>

<style lang="scss">
	section {
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		:global(a) {
			&:hover {
				text-decoration: underline;
			}
		}
	}
</style>

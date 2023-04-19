<script>
	import TwitterNews from '../../../lib/components/landing-page/twitterNews.svelte';
</script>

<section>
	<div class="blog container-xl">
		<div class="left">
			<h1>Noticias</h1>
			<p>
				Donde se comenta la actualidad del proyecto. Prueba a hacer{' '}
				<strong>hacer click</strong> sobre algún tweet para visualizarlo mejor.
			</p>
		</div>
		<div class="right">
			<TwitterNews />
		</div>
	</div>
</section>

<style lang="scss">
	section {
		padding: 1rem;
		display: grid;
		place-items: center;
		margin-bottom: 5rem;
	}
	.blog {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 2rem;

		.left {
			max-width: 350px;
		}
	}
</style>

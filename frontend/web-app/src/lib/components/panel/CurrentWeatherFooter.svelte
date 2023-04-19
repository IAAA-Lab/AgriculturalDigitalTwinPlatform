<script lang="ts">
	export let producer: string;
	export let web: string;
	export let copyright: string;
	export let legalNote: string;
</script>

<footer>
	<div class="footer__left text-xs">
		<p class="footer__left__producer text-xs m-0">{producer}</p>
		<a href={web} target="_blank" class="footer__left__web text-xxs">{web}</a>
	</div>
	<div class="footer__right text-xs">
		<!-- <p class="footer__right__copyright text-xs m-0">{copyright}</p> -->
	</div>
</footer>

<style>
	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		text-align: center;
	}
</style>

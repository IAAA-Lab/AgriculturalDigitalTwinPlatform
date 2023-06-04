<script lang="ts">
	import Footer from '$lib/components/landing-page/footer.svelte';
	import Header from '$lib/components/landing-page/header.svelte';
	import { beforeUpdate } from 'svelte';

	// It will execute every time the component is updated, not only the first time
	beforeUpdate(() => {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((e) => {
				if (e.isIntersecting) {
					e.target.classList.add('is-revealed');
				}
			});
		});
		const elemsWithIds = document.querySelectorAll('[class*=reveal]');
		elemsWithIds.forEach((elem) => observer.observe(elem));
	});
</script>

<div class="landing">
	<Header />
	<main class="has-animations">
		<slot />
	</main>
	<Footer />
</div>

<style global lang="scss">
</style>

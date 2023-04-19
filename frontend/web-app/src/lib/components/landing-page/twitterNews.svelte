<script>
	import { onMount } from 'svelte';
	import Loading from '../misc/Loading.svelte';

	let isLoaded = false;

	function createTweets() {
		// cleanupTweets(); // first deletes any existing tweets on the page
		var tweets = document.getElementsByClassName('tweetToEmbed');
		for (var i = 0; i < tweets.length; i++) {
			var tweet = tweets[i];
			var parent = tweet.parentElement;
			// @ts-ignore
			window.twttr.widgets.createTweet(tweet.innerText, parent, {
				align: 'center',
				dnt: 'true'
			});
		}
		isLoaded = true;
	}

	onMount(() => {
		createTweets();
	});
</script>

<section>
	<p class="tweetToEmbed">1536101242832822272</p>
	<p class="tweetToEmbed">1529155977748135937</p>
	<p class="tweetToEmbed">1508717443082035203</p>
	{#if !isLoaded}
		<Loading />
	{/if}
</section>

<style>
	section {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: start;
		flex-wrap: wrap;
		gap: 2rem;
	}
	.tweetToEmbed {
		display: none;
	}

	:global(.twitter-tweet, .twitter-tweet-rendered) {
		max-width: 300px !important;
	}
</style>

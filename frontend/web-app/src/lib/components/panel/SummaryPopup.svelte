<script lang="ts">
	import { CupertinoPane } from 'cupertino-pane';
	import { onDestroy, onMount } from 'svelte';
	import Summary from './Summary.svelte';

	const settings = {
		parentElement: 'body',
		fitHeight: true,
		backdrop: true,
		backdropOpacity: 0.2,
		bottomClose: true,
		buttonClose: false,
		showDraggable: true,
		upperThanTop: true,
		bottomOffset: 20
	};

	let summaryPopup: CupertinoPane;

	const toggleSummaryPopup = () => {
		if (summaryPopup.isPanePresented()) {
			summaryPopup.destroy({ animate: true });
		} else {
			summaryPopup.present({ animate: true });
		}
	};

	onMount(async () => {
		summaryPopup = new CupertinoPane('.summary-pop-up', settings);
	});

	onDestroy(() => {
		summaryPopup.destroy();
	});
</script>

<i class="fi fi-rr-comment summary-icon" on:click={toggleSummaryPopup} />
<div class="summary-pop-up p-16 mb-16">
	<Summary />
</div>

<style lang="scss">
	:global(*) {
		.pane {
			overflow: hidden !important;
			.destroy-button {
				cursor: pointer !important;
				z-index: 1000 !important;
			}
		}
		.summary-icon {
			color: color(secondary);
			cursor: pointer;
			display: none;
		}
	}
</style>

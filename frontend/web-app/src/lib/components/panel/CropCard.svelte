<script lang="ts">
	import { IMAGES_SERVER_URL } from '$lib/config/config';
	import type { Crop } from '$lib/core/Domain';
	import { onCropImageError } from '$lib/core/functions';
	import CardInner from './CardInner.svelte';

	export let crop: Crop;
</script>

<CardInner>
	<div slot="body" class="crop">
		<div class="crop__header">
			<img
				src={`${IMAGES_SERVER_URL}/${crop.id}.png`}
				alt={crop.name}
				class="crop__image"
				style="max-width: 100px;"
				on:error={onCropImageError}
			/>
			<h4 class="m-0">{crop.name.toUpperCase()}</h4>
			<span class="text-xs">{crop.variety || '--'}</span>
		</div>
		<div class="crop__divider" />
		<div class="crop__body">
			<div class="crop__body__item">
				<i class="fi fi-rr-map-marker" />
				<span class="text-xs m-0"> -- </span>
			</div>
			<div class="crop__body__item">
				<i class="fi fi-rr-money" />
				<span class="text-xs m-0"> -- </span>
			</div>
			<div class="crop__body__item">
				<i class="fi fi-rr-stats" />
				<span class="text-xs m-0"> -- </span>
			</div>
			<div class="crop__body__item">
				<i class="fi fi-rr-hand-holding-seeding" />
				<span class="text-xs m-0"> -- </span>
			</div>
			<div class="crop__body__item">
				<i class="fi fi-rr-tractor" />
				<span class="text-xs m-0"> -- </span>
			</div>
		</div>
	</div>
</CardInner>

<style>
	.crop {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		margin: 0.5rem;
		column-gap: 0.5rem;
	}
	.crop__header {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		row-gap: 0.25rem;
		text-transform: uppercase;
	}

	.crop__body {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		row-gap: 0.2rem;
	}

	.crop__body__item {
		display: flex;
		flex-direction: row;
		justify-content: start;
		align-items: center;
		column-gap: 0.5rem;
		margin-left: 1rem;
	}

	.crop__divider {
		width: 1.75px;
		height: 100px;
		background: #e3e3e3;
		border-radius: 10px;
	}
</style>

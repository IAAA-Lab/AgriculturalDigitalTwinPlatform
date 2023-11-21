<script lang="ts">
	import { page } from '$app/stores';
	import CropStats from '$lib/components/panel/CropStats.svelte';
	import Treatments from '$lib/components/panel/Treatments.svelte';

	let id: string;
	$: id = $page.data.id;
</script>

<div class="container-responsive">
	<h1 class="title pb-16">Recinto#{id} · Cultivos</h1>
	<CropStats enclosureId={id} />
	<Treatments enclosureId={id} />
	<br />
</div>

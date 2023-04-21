<script lang="ts">
	import { page } from '$app/stores';
	import Treatments from '$lib/components/panel/Treatments.svelte';

	let id: string;
	$: id = $page.params.id;
</script>

<div class="container-responsive">
	<h1 class="title pb-16">Recinto#{id} · Plantas</h1>
	<!-- <CropStats enclosureId={id} /> -->
	<!-- <br /> -->
	<Treatments enclosureId={id} />
	<br />
	<!-- <Fertilizers /> -->
</div>

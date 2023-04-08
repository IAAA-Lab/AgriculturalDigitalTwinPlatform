<script>
  import CropStats from "./sections/CropStats.svelte";
  import Fertilizers from "./sections/Fertilizers.svelte";
  import Treatments from "./sections/Treatments.svelte";

  export let id;
</script>

<h1 class="title">Recinto#{id} · Plantas</h1>
<div class="container-responsive">
  <!-- <CropStats enclosureId={id} /> -->
  <!-- <br /> -->
  <Treatments enclosureId={id} />
  <br />
  <!-- <Fertilizers /> -->
</div>

<script>
  import CropStats from "./sections/CropStats.svelte";
  import Fertilizers from "./sections/Fertilizers.svelte";
  import Treatments from "./sections/Treatments.svelte";

  export let id;
</script>

<div class="container-responsive">
  <h1 class="title">Recinto#{id} · Plantas</h1>
  <!-- <CropStats enclosureId={id} /> -->
  <!-- <br /> -->
  <Treatments enclosureId={id} />
  <br />
  <!-- <Fertilizers /> -->
</div>

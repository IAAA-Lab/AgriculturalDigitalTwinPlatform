<script>
  import CropStats from "./sections/CropStats.svelte";
  import Fertilizers from "./sections/Fertilizers.svelte";
  import Phytosanitaries from "./sections/Phytosanitaries.svelte";

  export let id;
</script>

<h1 class="title">Recinto#{id} · Plantas</h1>
<div class="container-responsive">
  <CropStats />
  <br />
  <Phytosanitaries />
  <br />
  <Fertilizers />
</div>

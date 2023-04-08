<script>
  import { enclosuresService } from "src/app/config/config";
  import Card from "src/lib/infraestructure/presentation/components/cards/Card.svelte";
  import Error from "src/lib/infraestructure/presentation/components/misc/Error.svelte";
  import Loading from "src/lib/infraestructure/presentation/components/misc/Loading.svelte";
  import { Link } from "svelte-routing";
  import CropCard from "../components/CropCard.svelte";

  export let enclosureId;
  export let crop;
</script>

<section>
  <Card>
    <h3 slot="header" class="m-0 mb-16">Plantas cultivadas</h3>
    <svelte:fragment slot="body">
      <Link to="/enclosure/{enclosureId}/crops">
        <CropCard {crop} />
      </Link>
    </svelte:fragment>
  </Card>
</section>

<style type="scss">
  section {
    grid-area: crops;
  }
  :global(a) {
    width: 100%;
  }
</style>

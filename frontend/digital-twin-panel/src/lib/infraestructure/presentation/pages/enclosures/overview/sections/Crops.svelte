<script>
  import { parcelsService } from "src/app/config/config";
  import Card from "src/lib/infraestructure/presentation/components/cards/Card.svelte";
  import Error from "src/lib/infraestructure/presentation/components/misc/Error.svelte";
  import Loading from "src/lib/infraestructure/presentation/components/misc/Loading.svelte";
  import { Link } from "svelte-routing";
  import CropCard from "../components/CropCard.svelte";

  export let enclosureId;
  export let cropId;
</script>

<section>
  {#await parcelsService.getCropStats(enclosureId)}
    <Loading />
  {:then cropStats}
    <Card>
      <h3 slot="header" class="m-0 mb-16">Plantas cultivadas</h3>
      <svelte:fragment slot="body">
        <div class="crops__wrapper">
          <Link to="/enclosure/{enclosureId}/crops">
            <CropCard crop={cropId} {cropStats} />
          </Link>
        </div>
      </svelte:fragment>
    </Card>
  {:catch}
    <Error />
  {/await}
</section>

<style>
  section {
    grid-area: crops;
  }

  .crops__wrapper {
    display: flex;
    flex-wrap: wrap;
    column-gap: 1rem;
    row-gap: 1rem;
  }

  .crop {
  }
</style>

<script>
  import Error from "src/lib/infraestructure/presentation/components/misc/Error.svelte";
  import Loading from "src/lib/infraestructure/presentation/components/misc/Loading.svelte";
  import { parcelsService } from "src/app/config/config";
  import EnclosureMap from "../components/EnclosureMap.svelte";

  export let enclosureId;
</script>

{#await parcelsService.getEnclosures([])}
  <Loading />
{:then parcels}
  {@const parcel = parcels.find((enc) =>
    enc.enclosures.features.some((e) => e.id === enclosureId)
  )}
  {@const enclosure = parcel?.enclosures.features.find(
    (e) => e.id === enclosureId
  )}
  {#if !enclosure}
    <Error />
  {:else}
    <EnclosureMap {enclosure} />
  {/if}
{:catch}
  <Error />
{/await}
